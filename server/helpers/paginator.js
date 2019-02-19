const paginator = async (modelName, { query: { page, limit } }, includedModels, whereClause) => {
  limit = 4;
  const modifiedPage = page - 1;
  const offset = parseInt(modifiedPage, 10) * limit;
  const endOfList = 'This is the end of the list';
  if (page <= 0 || Number.isInteger(Number(modifiedPage) === false || limit > 8)) {
    return undefined;
  }
  try {
    const { rows, count } = await modelName.findAndCountAll({
      limit,
      offset,
      where: whereClause,
      include: includedModels
    });
    if (offset >= count) {
      return endOfList;
    }
    const data = rows.map(row => row.dataValues);
    return data;
  } catch (error) {
    return error;
  }
};
export default paginator;
