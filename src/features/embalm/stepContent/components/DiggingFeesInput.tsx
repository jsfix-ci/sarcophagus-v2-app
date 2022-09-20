import {
  Flex,
  Image,
  NumberInput,
  NumberInputField,
  InputLeftElement,
  InputGroup,
  UseNumberInputProps,
} from '@chakra-ui/react';
import { removeLeadingZeroes, removeNonIntChars } from 'lib/utils/helpers';

interface DiggingFeesInputProps extends UseNumberInputProps {
  setDiggingFees: (value: string) => void;
  placeholder?: string;
}

export function DiggingFeesInput({
  setDiggingFees,
  placeholder = '',
  ...rest
}: DiggingFeesInputProps) {
  function handleChangeDiggingFees(valueAsString: string, valueAsNumber: number) {
    valueAsString = removeNonIntChars(valueAsString);
    valueAsString = removeLeadingZeroes(valueAsString);

    if (valueAsNumber < 0) {
      valueAsString = '0';
      valueAsNumber = 0;
    }

    if (valueAsString.length > 18) return;

    setDiggingFees(valueAsString);
  }

  return (
    <Flex align="center">
      <InputGroup>
        <NumberInput
          w="150px"
          onChange={handleChangeDiggingFees}
          {...rest}
        >
          <NumberInputField
            pl={12}
            pr={1}
            placeholder={placeholder}
            borderColor="violet.700"
          />
          <InputLeftElement>
            <Image src="sarco-token-icon.png" />
          </InputLeftElement>
        </NumberInput>
      </InputGroup>
    </Flex>
  );
}
