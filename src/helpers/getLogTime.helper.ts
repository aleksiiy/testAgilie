export default () => {
  const d = new Date();
  return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
};
