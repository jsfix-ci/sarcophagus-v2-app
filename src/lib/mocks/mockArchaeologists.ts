// Generates random mock archaeologists for building the interface.
// TODO: Remove this when we have real archaeologists.

import { BigNumber } from 'ethers';
import { Archaeologist } from 'types';
import { generateFakeAddress, randomIntFromInterval } from '../utils/helpers';

/**
 * Temporary function.
 * Generates mock archaeologists for the archaeologist list.
 * This does not use the mock private keys to create wallets, it just generates stuff to show on the
 * table
 */
export function generateMockArchaeoloigsts() {
  const count = 10;
  const minDiggingFee = 10;
  const maxDiggingFee = 50;
  let mockArchaeologists: Archaeologist[] = [];
  for (let i = 0; i < count; i++) {
    mockArchaeologists.push({
      profile: {
        archAddress: generateFakeAddress(),
        exists: true,
        minimumDiggingFee: BigNumber.from(randomIntFromInterval(minDiggingFee, maxDiggingFee)),
        // random number between 1 week and 1 month
        maximumRewrapInterval: randomIntFromInterval(604800000, 2628000000),
        peerId: '',
        successes: [],
        cancels: [],
        accusals: [],
      },
      isOnline: true,
    });
  }
  return mockArchaeologists;
}
