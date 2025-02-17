import { EditIcon } from '@chakra-ui/icons';
import { Button, IconButton, TableRowProps, Td, Text, Tooltip, Tr } from '@chakra-ui/react';
import { TableText } from 'components/TableText';
import { BigNumber } from 'ethers';
import { useCleanSarcophagus } from 'hooks/thirdPartyFacet/useCleanSarcophagus';
import { buildResurrectionDateString } from 'lib/utils/helpers';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sarcophagus, SarcophagusState } from 'types';
import { useAccount } from 'wagmi';
import { SarcoStateIndicator } from './SarcoStateIndicator';

export enum SarcoAction {
  Rewrap = 'rewrap',
  Clean = 'clean',
  Claim = 'claim',
}

export interface SarcophagusTableRowProps extends TableRowProps {
  sarco: Sarcophagus;
  isClaimTab?: boolean;
}

/**
 * Custom TableRow component to be used in place of the default Tr component. Adds a sort icon.
 */
export function SarcoTableRow({ sarco, isClaimTab }: SarcophagusTableRowProps) {
  const { address } = useAccount();
  const navigate = useNavigate();

  // Payment for clean automatically goes to the current user
  const { clean, isLoading, isCleaning } = useCleanSarcophagus(sarco.id, address);

  const resurrectionString = buildResurrectionDateString(
    sarco.resurrectionTime || BigNumber.from(0)
  );

  // If we ever decide to add a dashboard for archaeologists that case will need to be considered
  // here.
  // This logic shows the actions a user can make on a sarcophagus regardless of which tab they are
  // on. If a user is both the embalmer and the recipient on a sarcohpagus, they will see both the
  // rewrap and resurrect actions on the "My Sarcophagi" tab and the "Claim Sarcophagi" tab.
  const isEmbalmer = sarco.embalmerAddress === address;
  const isRecipient = sarco.recipientAddress === address;

  const stateToActionMap: {
    [key: string]: {
      action?: SarcoAction;
      tooltip?: string;
    };
  } = {
    [SarcophagusState.Active]: {
      action: isEmbalmer && !isClaimTab ? SarcoAction.Rewrap : undefined,
      tooltip: isEmbalmer && !isClaimTab ? 'Extend the resurrection date of the Sarcophagus' : '',
    },
    [SarcophagusState.Resurrected]: {
      action: isRecipient && isClaimTab ? SarcoAction.Claim : undefined,
      tooltip: isRecipient && isClaimTab ? 'Decrypt and download the Sarcophagus payload' : '',
    },
    [SarcophagusState.CleanedResurrected]: {
      action: isRecipient && isClaimTab ? SarcoAction.Claim : undefined,
      tooltip: isRecipient && isClaimTab ? 'Decrypt and download the Sarcophagus payload' : '',
    },
  };

  const action = stateToActionMap[sarco.state]?.action;
  const actionTooltip = stateToActionMap[sarco.state]?.tooltip;

  function handleClickAction() {
    switch (action) {
      case SarcoAction.Rewrap:
        navigate(`${sarco.id}?action=rewrap`);
        break;
      case SarcoAction.Claim:
        navigate(`${sarco.id}?action=claim`);
        break;
      case SarcoAction.Clean:
        clean?.();
        break;
      default:
        break;
    }
  }

  return (
    <Tr>
      {/* SARCO STATE */}
      <Td>
        <SarcoStateIndicator state={sarco.state} />
      </Td>

      {/* SARCO NAME */}
      <Td>
        <TableText>{sarco.name?.toUpperCase()}</TableText>
      </Td>

      {/* SARCO RESURRECTION */}
      <Td>
        <TableText>{resurrectionString}</TableText>
      </Td>

      {/* QUICK ACTION */}
      <Td textAlign="center">
        {action ? (
          <Tooltip
            isDisabled={!actionTooltip}
            openDelay={500}
            label={actionTooltip}
            placement="right-start"
          >
            <Button
              variant="link"
              onClick={handleClickAction}
              isLoading={isLoading || isCleaning}
            >
              {action.toUpperCase()}
            </Button>
          </Tooltip>
        ) : (
          <Text>--</Text>
        )}
      </Td>

      {/* SARCO DETAILS LINK */}
      <Td textAlign="center">
        <IconButton
          as={NavLink}
          to={sarco.id || ''}
          aria-label="Details"
          variant="unstyled"
          icon={<EditIcon />}
        />
      </Td>
    </Tr>
  );
}
