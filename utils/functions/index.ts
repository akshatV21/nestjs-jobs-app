export function firstLetterUpperCase(str: string) {
  const strArray = str.split('')
  strArray[0] = str[0].toUpperCase()
  return strArray.join('')
}
