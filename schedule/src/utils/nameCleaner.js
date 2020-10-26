export default string =>
  string && string
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^а-я]/g, '')
