import { Flex, Text, VStack, HStack, Button, FlexProps, forwardRef } from '@chakra-ui/react';
import { Radio } from 'components/Radio';
import { useResurrection } from '../hooks/useResurrection';
import { DatePicker } from 'components/DatePicker';

export enum ResurrectionRadioValue {
  OneMonth = '1 month',
  TwoMonth = '2 months',
  ThreeMonths = '3 months',
}

export function Resurrection({ ...rest }: FlexProps) {
  const options = Object.values(ResurrectionRadioValue);

  const {
    error,
    getRadioProps,
    radioValue,
    customResurrectionDate,
    handleCustomDateChange,
    handleCustomDateClick,
  } = useResurrection();

  const CustomResurrectionButton = forwardRef(({ value, onClick }, ref) => (
    <Flex>
      <Button
        onClick={onClick}
        ref={ref}
        variant={radioValue !== 'Other' ? 'disabledLook' : 'main'}
      >
        {/* this value is an empty string, so this logic evalutate true on null | undefinded | '' */}
        {value ? value : 'Custom Date'}
      </Button>
    </Flex>
  ));

  return (
    <Flex
      direction="column"
      {...rest}
    >
      <VStack
        align="left"
        spacing="5"
        border="1px solid "
        borderColor="violet.700"
        px={9}
        py={6}
      >
        <HStack spacing={6}>
          <Radio {...getRadioProps({ value: options[0] })}>{options[0]}</Radio>
          <Radio {...getRadioProps({ value: options[1] })}>{options[1]}</Radio>
          <Radio {...getRadioProps({ value: options[2] })}>{options[2]}</Radio>
        </HStack>
        <HStack spacing={6}>
          <Radio {...getRadioProps({ value: 'Other' })}>
            <DatePicker
              selected={customResurrectionDate}
              onChange={handleCustomDateChange}
              onInputClick={handleCustomDateClick}
              showTimeSelect
              minDate={new Date()}
              showPopperArrow={false}
              timeIntervals={30}
              timeCaption="Time"
              timeFormat="hh:mma"
              dateFormat="MM.dd.yyyy hh:mma"
              fixedHeight
              customInput={<CustomResurrectionButton />}
            />
          </Radio>
        </HStack>
      </VStack>
      {error && (
        <Text
          mt={3}
          textAlign="center"
          color="error"
        >
          {error}
        </Text>
      )}
    </Flex>
  );
}
