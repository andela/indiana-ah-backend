import BookmarkRepository from '../db/repositories/bookmarks';
import CommentRepository from '../db/repositories/comments';
import ReactionRepository from '../db/repositories/reactions';
import readingStatRepository from '../db/repositories/readingStats';
import statisticFormatter from './statisticFormatter';

const readingStatRepo = new readingStatRepository();
const bookmarkRepo = new BookmarkRepository();
const commentRepo = new CommentRepository();
const reactionRepo = new ReactionRepository();

const getUsersStats = async (userId) => {
  const numOfReads = await readingStatRepo.findAndCountStats(userId);
  const numOfBookmarked = await bookmarkRepo.findAndCountStats(userId);
  const numOfComment = await commentRepo.findAndCountStats(userId);
  const numOfReactions = await reactionRepo.findAndCountStats(userId);
  const formatStat = statisticFormatter(numOfReads, numOfBookmarked, numOfComment, numOfReactions);
  return formatStat;
};
export default getUsersStats;
