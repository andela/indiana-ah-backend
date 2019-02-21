const paginator = async (
  modelName,
  { query: { page, limit = 4 } },
  includedModels,
  whereClause
) => {
  const MAX = 8;
  if (limit > MAX) {
    limit = MAX;
  }
  const modifiedPage = page - 1;
  const offset = parseInt(modifiedPage, 10) * limit;
  if (page <= 0 || Number.isInteger(Number(modifiedPage) === false)) {
    return undefined;
  }
  try {
    const { rows } = await modelName.findAndCountAll({
      limit,
      offset,
      where: whereClause,
      include: includedModels
    });
    const data = rows.map(row => row.dataValues);
    return data;
  } catch (error) {
    return error;
  }
};
export default paginator;
