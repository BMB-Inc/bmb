export function oaDateToJsDate(oaDate: number): Date {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const oaEpochInJsEpoch = new Date(1968, 0, 0).getTime();
  return new Date(oaEpochInJsEpoch + oaDate * millisecondsPerDay);
}

export function jsDateToOaDate(jsDate: Date) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const jsEpochInOaEpoch = new Date(1968, 0, 0).getTime();
  return (jsDate.getTime() - jsEpochInOaEpoch) / millisecondsPerDay;
}
