import axios from "axios";

const github = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3.diff",
  },
});

export async function fetchPRDiff(prUrl: string) {
  const res = await github.get(prUrl);
  console.log("🔍 PR Diff:", res.data);
  return res.data as string;
}

export async function postPRComment(commentsUrl: string, body: string) {
    console.log("🔍 Posting PR Comment:", commentsUrl, body);
    await axios.post(
      commentsUrl,
      { body },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
  }