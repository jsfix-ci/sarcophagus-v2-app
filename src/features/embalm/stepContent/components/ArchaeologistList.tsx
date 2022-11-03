import {
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  VStack,
  Input,
} from '@chakra-ui/react';
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from '@chakra-ui/icons';
import { Loading } from 'components/Loading';
import { formatAddress } from 'lib/utils/helpers';
import { useArchaeologistList } from '../hooks/useArchaeologistList';
import { TablePageNavigator } from './TablePageNavigator';
import { SortDirection, setDiggingFeesFilter } from 'store/embalm/actions';
import { useDispatch } from 'store/index';
import { DiggingFeesInput } from './DiggingFeesInput';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useDialArchaeologists } from '../../../../hooks/utils/useDialArchaeologists';
import { useBootLibp2pNode } from '../../../../hooks/libp2p/useBootLibp2pNode';

export function ArchaeologistList({ includeDialButton }: { includeDialButton?: boolean }) {
  const {
    onClickNextPage,
    onClickPrevPage,
    handleCheckArchaeologist,
    selectedArchaeologists,
    sortedFilteredArchaeologist,
    onClickSortDiggingFees,
    diggingFeesSortDirection,
    handleChangeAddressSearch,
    diggingFeesFilter,
    archAddressSearch,
  } = useArchaeologistList();
  const dispatch = useDispatch();

  const sortIconsMap: { [key: number]: JSX.Element } = {
    [SortDirection.NONE]: <ArrowUpDownIcon> </ArrowUpDownIcon>,
    [SortDirection.ASC]: <ArrowUpIcon />,
    [SortDirection.DESC]: <ArrowDownIcon />,
  };

  function setDiggingFees(diggingFees: string) {
    return dispatch(setDiggingFeesFilter(diggingFees));
  }

  // Used for testing archaeologist connection
  // TODO -- can be removed once we resolve connection issues
  const [isDialing, setIsDialing] = useState(false);
  const { testDialArchaeologist, pingArchaeologist } = useDialArchaeologists(setIsDialing);
  useBootLibp2pNode();

  return (
    <Flex
      direction="column"
      height="100%"
      mt={6}
    >
      <Flex
        flex={4}
        height="100%"
        direction="column"
      >
        <Loading>
          <TableContainer
            width="100%"
            overflowY="auto"
            maxHeight="650px"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>
                    <VStack align="left">
                      <Text
                        variant="secondary"
                        textTransform="capitalize"
                        py={3}
                      >
                        Archaeologists ({sortedFilteredArchaeologist.length})
                      </Text>
                      <Input
                        w="200px"
                        onChange={handleChangeAddressSearch}
                        value={archAddressSearch}
                        placeholder="Search"
                        borderColor="violet.700"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  <Th isNumeric>
                    <VStack>
                      <Button
                        variant="ghost"
                        textTransform="capitalize"
                        rightIcon={sortIconsMap[diggingFeesSortDirection]}
                        onClick={onClickSortDiggingFees}
                      >
                        Digging Fee
                      </Button>
                      <DiggingFeesInput
                        setDiggingFees={setDiggingFees}
                        value={diggingFeesFilter}
                        placeholder="Max"
                        color="brand.950"
                      />
                    </VStack>
                  </Th>
                  {includeDialButton ? <Th>Dial</Th> : <></>}
                </Tr>
              </Thead>
              <Tbody>
                {sortedFilteredArchaeologist.map(arch => {
                  const isSelected =
                    selectedArchaeologists.findIndex(
                      a => a.profile.peerId === arch.profile.peerId
                    ) !== -1;

                  const rowTextColor = isSelected ? (arch.exception ? '' : 'brand.0') : '';

                  return (
                    <Tr
                      key={arch.profile.archAddress}
                      background={isSelected ? (arch.exception ? 'errorHighlight' : 'brand.700') : ''}
                      onClick={() => {
                        if (includeDialButton) return;
                        if (!isSelected) pingArchaeologist(arch.fullPeerId!);
                        handleCheckArchaeologist(arch);
                      }
                      }
                      cursor="pointer"
                      _hover={
                        isSelected
                          ? {}
                          : {
                            background: 'brand.100',
                          }
                      }
                    >
                      <Td>
                        <Text
                          color={rowTextColor}
                          ml={3}
                        >
                          {formatAddress(arch.profile.archAddress)}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <Flex justify="center">
                          <Image
                            src="sarco-token-icon.png"
                            w="18px"
                            h="18px"
                          />
                          <Text
                            ml={3}
                            color={rowTextColor}
                          >
                            {ethers.utils.formatEther(arch.profile.minimumDiggingFee)}
                          </Text>
                        </Flex>
                      </Td>
                      {includeDialButton ? (
                        <Td>
                          <Button
                            disabled={isDialing || !!arch.connection}
                            onClick={() => testDialArchaeologist(arch.fullPeerId!)}
                          >
                            {arch.connection ? 'Connected' : 'Dial'}
                          </Button>
                        </Td>
                      ) : (
                        <></>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          <TablePageNavigator
            onClickNext={onClickNextPage}
            onClickPrevious={onClickPrevPage}
            currentPage={1}
            totalPages={10}
          />
        </Loading>
      </Flex>
    </Flex>
  );
}
