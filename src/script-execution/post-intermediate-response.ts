import { Response, TextMessage } from 'hubot';

export const DEFAULT_INTERMEDIATE_RESPONSE_DELAY = 2000;

/**
 * If the response from spreadsheet has not been sent within some time, send an intermediate
 * response.
 * Otherwise, do not send anything to avoid sending too many messages.
 */
export function postIntermediateResponseWhenExecutionInProgressForSomeTime(
  response: Response<any, TextMessage>,
  executionPromise: Promise<any>,
  intermediateResponseDelay: number = DEFAULT_INTERMEDIATE_RESPONSE_DELAY,
) {
  const intermediateResponseTimeoutId = setTimeout(() => {
    response.reply("Hold on, I'm checking...");
  }, intermediateResponseDelay);

  executionPromise.then(() => {
    clearTimeout(intermediateResponseTimeoutId);
  });
}
