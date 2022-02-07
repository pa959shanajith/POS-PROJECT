import React, {useState} from "react";
import '../../assets/scss/pages/billing.scss';
import Overlay from "../../assets/scss/components/Overlay";
import PaymentMethod from "./PaymentMethod";
import SettleBillModal from "./SettleBillModal";
import BalanceModal from "./BalanceModal";
import { useHistory } from "react-router-dom";
import SettingIcon from '../../assets/images/setting-icon.svg';
import TablesModal from "./TablesModal";
import BillStatusModal from "./BillStatusModal";
import ViewAndAddCustomerInfoComponent from "./ViewAndAddCustomerInfoComponent";
import TakeAwayModalComponent from "./TakeAwayModalComponent";
import OnlineOrderModalComponent from "./OnlineOrderModalComponent";
import DeleteBillModalComponent from "./DeleteBillModalComponent";
import {toast} from "react-toastify";
import _ from "lodash";

export enum MODALS {
	PAYMENT_METHOD_MODAL= 'PAYMENT_METHOD_MODAL',
	SETTLE_BILL_MODAL= 'SETTLE_BILL_MODAL',
	BALANCE_MODAL= 'BALANCE_MODAL',
	BILL_STATUS_MODAL = 'BILL_STATUS_MODAL',
	TABLES_MODAL = 'TABLES_MODAL',
	TAKE_AWAY_MODAL = 'TAKE_AWAY_MODAL',
	ONLINE_ORDER_MODAL = 'ONLINE_ORDER_MODAL',
	DELETE_BILL_MODAL = 'DELETE_BILL_MODAL',
	CUSTOMER_INFO_MODAL = 'CUSTOMER_INFO_MODAL',
	NONE = 'NONE',
}

const BillingFooterContent = (props: any)=>{
	const [currentModalName, setCurrentModalName] = useState<MODALS>(MODALS.NONE);
	const [receivedAmount, setReceivedAmount] = useState(0);

	const history = useHistory();

	const navigateToSettings = () => {
		history.push('/settings');
	}

	const getCurrentlyOpenedModal = () => {
		switch(currentModalName) {
			case MODALS.TABLES_MODAL : {
				return (
					<TablesModal
						selectTable={props.selectTable}
						setModalState={updateModalStep}
						tablesData={props.tablesList}
					/>
				)
			}
			case MODALS.TAKE_AWAY_MODAL : {
				return (
					<TakeAwayModalComponent
						selectTakeAway={props.selectTakeAway}
						setModalState={updateModalStep}
					/>
				)
			}
			case MODALS.ONLINE_ORDER_MODAL : {
				return (
					<OnlineOrderModalComponent
						selectOnlinePlatform={props.selectOnlineOrder}
						setModalState={updateModalStep}
					/>
				)
			}
			case MODALS.PAYMENT_METHOD_MODAL : {
				return (
					<PaymentMethod
						setModalState={updateModalStep}
						setPaymentMethod={props.setMethodOfPayment}
					/>
				)
			}
			case MODALS.SETTLE_BILL_MODAL : {
				return (
					<SettleBillModal
						setModalState={updateModalStep}
						freezeBill={props.freezeBill}
						setReceivedPrice={setReceivedAmount}
						billAmount={props.billAmount}
						paymentMethod={props.methodOfPayment}
					/>
				)
			}
			case MODALS.BALANCE_MODAL : {
				return  (
					<BalanceModal
						setModalState={updateModalStep}
						balanceAmount={receivedAmount - props.billAmount} // TODO add a check that recieved price has to be greater than bill amount to continue
					/>
				)
			}
			case MODALS.BILL_STATUS_MODAL : {
				return  (
					<BillStatusModal
						setModalState={updateModalStep}
						loading={props.isBillingLoading}
						success={props.isBillingSuccess}
					/>
				)
			}
			case MODALS.DELETE_BILL_MODAL : {
				return  (
					<DeleteBillModalComponent
						setModalState={updateModalStep}
						deleteBill={props.deleteBill}
						loading={props.isDeleteBillLoading}
						success={props.isDeleteBillSuccess}
					/>
				)
			}
			case MODALS.CUSTOMER_INFO_MODAL : {
				return  (
					<ViewAndAddCustomerInfoComponent
						setModalState={updateModalStep}
						selectedOrderId={props.selectedOrder.id}
						attachCustomerToOrder={props.attachCustomerToOrder}
					/>
				)
			}
		}
	}

	const updateModalStep = async (step: MODALS) => {
		if (step === MODALS.NONE) {
			// reset state variables
			setReceivedAmount(0);
		}
		if (step === MODALS.BILL_STATUS_MODAL) {
			// Call the API to save billing data in BE
			props.handleAddBill();
		}
		if (step === MODALS.DELETE_BILL_MODAL) {
			if (!props.selectedOrder.id) {
				toast.error('No order is selected to generate the void bill');
				return
			} else if (_.isEmpty(props.selectedItemsInOrder)) {
				props.deleteBill()
				return;
			} else if (!checkIfAllItemsSentToKitchen()) {
				toast.error('Please make sure all items are sent to kitchen first!')
				return;
			}
		}
		setCurrentModalName(step)
	}

	const handleSettle = () => {
		const allItemsSentToKitchen = checkIfAllItemsSentToKitchen();
		if (allItemsSentToKitchen) {
			updateModalStep(MODALS.PAYMENT_METHOD_MODAL);
		} else {
			toast.error('Please make sure all items are sent to kitchen first!')
		}
	}

	const checkIfAllItemsSentToKitchen = () => {
		if (props.selectedOrder.id && props.selectedItemsInOrder?.length) {
			let allItemsSentToKitchen = true;
			props.selectedItemsInOrder.some((item: any) => {
				if (!item.sentToKitchen) {
					allItemsSentToKitchen = false;
					return true;
				}
				return false;
			})
			return allItemsSentToKitchen;
		}
		return false;
	}

	return (
		<div className="billing-page-footer">
			<div className="footer-list">
				  <ul className="action-list">
					  <li onClick={() => updateModalStep(MODALS.DELETE_BILL_MODAL)}>Delete Bill</li>
					  <li onClick={props.deleteSelectedBillItem}>Deleted Selected</li>
					  <li onClick={navigateToSettings}>
						  <img src={SettingIcon} alt={'i'}/>
					  </li>
					  <li onClick={() => updateModalStep(MODALS.CUSTOMER_INFO_MODAL)}>Customer Info</li>
					  <li onClick={() => updateModalStep(MODALS.TABLES_MODAL)}>Dine in</li>
					  <li onClick={() => updateModalStep(MODALS.TAKE_AWAY_MODAL)}>Take-Away</li>
					  <li onClick={() => updateModalStep(MODALS.ONLINE_ORDER_MODAL)}>Online Orders</li>
					  <li>Re-Print</li>
					  <li onClick={handleSettle}>Settle</li>
				  </ul>
			</div>
			{ currentModalName !== MODALS.NONE && (
				<Overlay closeOverlay={() => updateModalStep(MODALS.NONE)}>
					{ getCurrentlyOpenedModal() }
				</Overlay>
			)}
		</div>
	)
};

export default BillingFooterContent;
