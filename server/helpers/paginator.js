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
  if (
    page <= 0
    || limit <= 0
    || Number.isInteger(Number(modifiedPage) === false)
    || Number.isInteger(Number(limit) === false)
  ) {
    return undefined;
  }
  try {
    const { rows, count } = await modelName.findAndCountAll({
      limit: page ? limit : undefined,
      offset: page ? offset : undefined,
      where: whereClause,
      include: includedModels
    });
    const data = rows.map(row => row.dataValues);

    const totalNumberOfPages = Math.ceil(count / 4);
    return { data, totalNumberOfPages };
  } catch (error) {
    return error;
  }
};
export default paginator;
