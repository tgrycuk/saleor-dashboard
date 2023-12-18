import { DashboardCard } from "@dashboard/components/Card";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import PriceField from "@dashboard/components/PriceField";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import {
  OrderDetailsFragment,
  OrderGrantRefundCreateErrorFragment,
  PermissionEnum,
  TransactionRequestRefundForGrantedRefundErrorFragment,
} from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { PaymentSubmitCardValuesProps } from "@dashboard/orders/components/OrderReturnPage/components/PaymentSubmitCard/PaymentSubmitCardValues";
import { IMoney } from "@dashboard/utils/intl";
import { Box, Checkbox, InfoIcon, Text, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderReturnData } from "../../form";
import { canSendRefundDuringReturn } from "../../utils";
import { submitCardMessages } from "./messages";

interface TransactionSubmitCardProps {
  disabled: boolean;
  onSubmit: () => void;
  submitStatus: ConfirmButtonTransitionState;
  autoGrantRefund: boolean;
  autoSendRefund: boolean;
  refundShipmentCosts: boolean;
  canRefundShipping: boolean;
  shippingCosts: IMoney;
  amountData: PaymentSubmitCardValuesProps;
  customRefundValue: number;
  onChange: FormChange;
  grantRefundErrors: OrderGrantRefundCreateErrorFragment[];
  sendRefundErrors: TransactionRequestRefundForGrantedRefundErrorFragment[];
  transactions: OrderDetailsFragment["transactions"];
}

export const TransactionSubmitCard = ({
  disabled,
  onSubmit,
  submitStatus,
  autoGrantRefund,
  autoSendRefund,
  refundShipmentCosts,
  canRefundShipping,
  amountData,
  onChange,
  customRefundValue,
  grantRefundErrors,
  sendRefundErrors,
  transactions,
}: TransactionSubmitCardProps) => {
  const intl = useIntl();

  const canSendRefund = canSendRefundDuringReturn({
    autoGrantRefund,
    transactions,
  });

  return (
    <div>
      <DashboardCard>
        <DashboardCard.Title>
          {intl.formatMessage(submitCardMessages.cardTitle)}
        </DashboardCard.Title>
        <DashboardCard.Content
          display="flex"
          flexDirection="column"
          gap={2}
          alignItems="start"
        >
          <Box display="flex" gap={1} alignItems="center" marginBottom={4}>
            <InfoIcon color="default2" size="small" />
            <Text color="default2">
              <FormattedMessage {...submitCardMessages.descrption} />
            </Text>
          </Box>
          <Checkbox
            checked={autoGrantRefund}
            error={grantRefundErrors.length > 0}
            name={"autoGrantRefund" satisfies keyof OrderReturnData}
            onCheckedChange={checked => {
              onChange({
                target: {
                  name: "autoGrantRefund",
                  value: checked,
                },
              });
            }}
          >
            <Text color={grantRefundErrors.length ? "critical1" : undefined}>
              <FormattedMessage {...submitCardMessages.autoGrantRefund} />
            </Text>
          </Checkbox>
          <RequirePermissions
            requiredPermissions={[PermissionEnum.HANDLE_PAYMENTS]}
          >
            {canSendRefund.value ? (
              <Checkbox
                checked={autoSendRefund}
                error={sendRefundErrors.length > 0}
                name={"autoSendRefund" satisfies keyof OrderReturnData}
                onCheckedChange={checked => {
                  onChange({
                    target: {
                      name: "autoSendRefund",
                      value: checked,
                    },
                  });
                }}
              >
                <Text color={sendRefundErrors.length ? "critical1" : undefined}>
                  <FormattedMessage {...submitCardMessages.autoSendRefund} />
                </Text>
              </Checkbox>
            ) : (
              <Tooltip>
                <Tooltip.Trigger>
                  <Checkbox checked={false} disabled={true}>
                    <Text color="defaultDisabled">
                      <FormattedMessage
                        {...submitCardMessages.autoSendRefund}
                      />
                    </Text>
                  </Checkbox>
                </Tooltip.Trigger>
                <Tooltip.Content>
                  <Tooltip.Arrow />
                  <FormattedMessage {...canSendRefund.reason} />
                </Tooltip.Content>
              </Tooltip>
            )}
          </RequirePermissions>
          <Checkbox
            marginTop={4}
            checked={refundShipmentCosts}
            name={"refundShipmentCosts" satisfies keyof OrderReturnData}
            onCheckedChange={checked => {
              onChange({
                target: {
                  name: "refundShipmentCosts",
                  value: checked,
                },
              });
            }}
            disabled={!canRefundShipping || !autoGrantRefund}
          >
            <Text
              color={
                !canRefundShipping || !autoGrantRefund
                  ? "defaultDisabled"
                  : undefined
              }
            >
              <FormattedMessage
                {...submitCardMessages.refundShipment}
                values={{
                  currency: amountData?.shipmentCost?.currency,
                  amount: amountData?.shipmentCost?.amount,
                }}
              />
            </Text>
          </Checkbox>
          <PriceField
            label={intl.formatMessage(
              submitCardMessages.returnRefundValueLabel,
            )}
            onChange={onChange}
            name="amount"
            value={
              autoGrantRefund
                ? customRefundValue?.toString() ??
                  amountData?.refundTotalAmount?.amount?.toString()
                : ""
            }
            currencySymbol={amountData?.refundTotalAmount?.currency}
            disabled={!autoGrantRefund}
          />
          <Box display="flex" alignSelf="end" marginTop={4}>
            <ConfirmButton
              data-test-id="return-submit-button"
              transitionState={submitStatus}
              disabled={disabled}
              variant="primary"
              onClick={onSubmit}
            >
              <FormattedMessage {...submitCardMessages.submitButton} />
            </ConfirmButton>
          </Box>
        </DashboardCard.Content>
      </DashboardCard>
    </div>
  );
};
