import { NextRequest, NextResponse } from "next/server";
import { fetchPRDiff, postPRComment } from "@/app/lib/github";
import { extractChangedLines } from "@/app/lib/diff";
import { reviewCode } from "@/app/lib/ai";

export async function POST(req: NextRequest) {
  const event = req.headers.get("x-github-event");
  const payload = await req.json();

  if (event !== "pull_request") {
    return NextResponse.json({ ok: true });
  }

  const action = payload.action;
  if (action !== "opened" && action !== "synchronize") {
    return NextResponse.json({ ok: true });
  }

  const pr = payload.pull_request;

  console.log("🔍 Reviewing PR:", pr.title);

  try {
    const diff = await fetchPRDiff(pr.url);
    const changedCode = extractChangedLines(diff);

    if (!changedCode) {
      console.log("No relevant code changes");
      return NextResponse.json({ ok: true });
    }

    const aiReview = await reviewCode(changedCode);

    if (!aiReview || aiReview.includes("UNCERTAIN")) {
      console.log("AI unsure, skipping comment");
      return NextResponse.json({ ok: true });
    }

    await postPRComment(
      pr.comments_url,
      `🤖 **AI Code Review**\n\n${aiReview}`
    );

    console.log("✅ Comment posted");
  } catch (err) {
    console.error("❌ Review error:", err);
  }

  return NextResponse.json({ ok: true });
}
