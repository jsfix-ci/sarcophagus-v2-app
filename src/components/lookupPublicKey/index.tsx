import { VStack, Heading, Input, FormLabel, Button, Text, FormControl } from '@chakra-ui/react';
import { useState } from 'react';
import { useLookupPublicKey, LookupPublicKeyStatus } from './useLookupPublicKey';

const LookupPublicKeyStatusMessageMap = new Map([
  [null, ''],
  [LookupPublicKeyStatus.SUCCESS, 'Successfully retrieved public key'],
  [LookupPublicKeyStatus.ERROR, 'Error retrieving public key'],
  [LookupPublicKeyStatus.NO_TRANSACTIONS, 'No transactions available, cannot lookup public key'],
  [LookupPublicKeyStatus.LOADING, 'Loading...'],
  [LookupPublicKeyStatus.INVALID_ADDRESS, 'Invalid address'],
  [LookupPublicKeyStatus.NOT_CONNECTED, 'Wallet not connected'],
  [LookupPublicKeyStatus.WRONG_NETWORK, 'Wallet connected non-supported network'],
]);

export function LookupPublicKey() {
  const [address, setAddress] = useState('');

  const { lookupPublicKey, lookupStatus, publicKey, isLoading } = useLookupPublicKey();

  async function handleOnClick(): Promise<void> {
    await lookupPublicKey(address);
  }

  return (
    <VStack align="left">
      <Heading>Lookup Public Key</Heading>
      <FormControl isDisabled={!isLoading}>
        <FormLabel>Etherum Address</FormLabel>
        <Input
          placeholder="0x0..."
          onChange={e => setAddress(e.currentTarget.value)}
          value={address}
        />
        <Button
          background="gray"
          width={20}
          onClick={handleOnClick}
          isLoading={isLoading}
        >
          Submit
        </Button>
      </FormControl>
      <Text>Status:{LookupPublicKeyStatusMessageMap.get(lookupStatus)}</Text>
      <Text>Public Key:{publicKey}</Text>
    </VStack>
  );
}
