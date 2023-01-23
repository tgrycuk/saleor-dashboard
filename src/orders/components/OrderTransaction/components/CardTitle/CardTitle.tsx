import DefaultCardTitle from "@dashboard/components/CardTitle";
import {
  TransactionActionEnum,
  TransactionItemFragment,
} from "@dashboard/graphql";
import { IconButton } from "@material-ui/core";
import { Button, LinkIcon } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderTransactionProps } from "../../OrderTransaction";
import { mapActionToMessage } from "../../utils";
import { messages } from "./messages";
import { MoneyDisplay } from "./MoneyDisplay";
import { useStyles } from "./styles";

interface CardTitleProps {
  title: string;
  id: string;
  refundedAmount: TransactionItemFragment["refundedAmount"];
  chargedAmount: TransactionItemFragment["chargedAmount"];
  authorizedAmount: TransactionItemFragment["authorizedAmount"];
  actions: TransactionItemFragment["actions"];
  link?: string;
  className?: string;
  onTransactionAction: OrderTransactionProps["onTransactionAction"];
  showActions?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  title,
  id,
  onTransactionAction,
  refundedAmount,
  chargedAmount,
  authorizedAmount,
  actions,
  link,
  showActions = true,
  className,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const TransactionLink = link ? "a" : "span";

  return (
    <DefaultCardTitle
      className={className}
      title={
        <div className={classes.title}>
          <TransactionLink href={link} className={classes.methodName}>
            {link && (
              <IconButton>
                <LinkIcon />
              </IconButton>
            )}
            {title}
          </TransactionLink>

          <div className={classes.dataDisplay}>
            {showActions &&
              actions
                .filter(action => action !== TransactionActionEnum.REFUND)
                .map(action => (
                  <Button
                    variant="tertiary"
                    onClick={() => onTransactionAction(id, action)}
                  >
                    <FormattedMessage {...mapActionToMessage[action]} />
                  </Button>
                ))}

            {/* TODO: Pending refund */}

            {refundedAmount.amount > 0 && (
              <MoneyDisplay
                label={intl.formatMessage(messages.refunded)}
                money={refundedAmount}
              />
            )}

            {/* TODO: Pending capture */}

            <MoneyDisplay
              label={intl.formatMessage(messages.charged)}
              money={chargedAmount}
            />

            {authorizedAmount.amount > 0 && (
              <>
                <MoneyDisplay
                  label={intl.formatMessage(messages.authorized)}
                  money={authorizedAmount}
                />
              </>
            )}
          </div>
        </div>
      }
    />
  );
};
