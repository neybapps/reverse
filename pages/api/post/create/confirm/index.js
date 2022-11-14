import { getData, create } from '../../../_blockchain';
import { getStaticData, find } from '../../../_data';
import { sortByDate } from '../../../_utils';

export default async function (req, res) {
  const { tabs } = getStaticData();
  const { transactions } = getData();

  if (!tabs || !transactions) {
    res
      .status(200)
      .json({
        isError: true,
        message: 'Error fetching data.',
        tabs: [],
        posts: []
      });

    return;
  }

  const posts = sortByDate(
    transactions.filter(({ type }) => type === 'Comment')
  );

  const { post } = req.query;

  const content = await find(post, 'posts');

  if (!content) {
    res
      .status(200)
      .json({
        isError: true,
        message: 'Invalid one-time password.',
        tabs,
        posts
      });

    return;
  }

  create(content);

  res
    .status(200)
    .json({
      message: 'Post successful! Sharing with peers...',
      tabs,
      posts: [
        content,

        ...posts
      ]
    });
}
