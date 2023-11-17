import { MenuItem, SubMenu } from "@dashboard/components/SubMenu";
import {
  ArrowDownIcon,
  Box,
  Button,
  PlusIcon,
  Popover,
} from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export interface VoucherCodesAddButtonProps {
  onMultiCodesGenerate: () => void;
  onSingleCodesGenerate: () => void;
}

export const VoucherCodesAddButton = ({
  onMultiCodesGenerate,
  onSingleCodesGenerate,
}: VoucherCodesAddButtonProps) => {
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const intl = useIntl();

  const handleMultupleCodesGenerate = useCallback(() => {
    onMultiCodesGenerate();
    setSubMenuOpen(false);
  }, []);

  const handleManualCodeGenerate = useCallback(() => {
    onSingleCodesGenerate();
    setSubMenuOpen(false);
  }, []);

  const subMenuItems = useMemo<MenuItem[]>(
    () => [
      {
        id: "manual",
        title: intl.formatMessage(messages.manual),
        description: intl.formatMessage(messages.manualDescription),
        onClick: handleManualCodeGenerate,
      },
      {
        id: "auto-generate-codes",
        title: intl.formatMessage(messages.autoGenerate),
        description: intl.formatMessage(messages.autoGenerateDescription),
        onClick: handleMultupleCodesGenerate,
      },
    ],
    [handleMultupleCodesGenerate, handleManualCodeGenerate],
  );

  return (
    <Popover open={isSubMenuOpen} onOpenChange={setSubMenuOpen}>
      <Popover.Trigger>
        <Button
          data-test-id="add-code-button"
          type="button"
          backgroundColor="interactiveNeutralDefault"
          color="textNeutralContrasted"
        >
          <PlusIcon />
          {intl.formatMessage(messages.addCode)}
          <ArrowDownIcon />
        </Button>
      </Popover.Trigger>
      <Popover.Content align="end">
        <Box marginTop={1}>
          <SubMenu menuItems={subMenuItems} />
        </Box>
      </Popover.Content>
    </Popover>
  );
};
