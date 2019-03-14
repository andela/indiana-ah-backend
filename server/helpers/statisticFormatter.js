const statisticFormatter = (numberOfReads, numberOfBookMarks, numOfComments, numberOfReactions) => {
  const statistics = {
    ReadingStat: numberOfReads,
    bookmarksStat: numberOfBookMarks,
    commentStat: numOfComments,
    reactionStat: {
      total: numberOfReactions.count,
      likes: numberOfReactions.likes,
      dislikes: numberOfReactions.dislikes
    }
  };
  return statistics;
};
export default statisticFormatter;
