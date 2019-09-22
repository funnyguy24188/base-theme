import { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CheckoutBilling from 'Component/CheckoutBilling';
import ContentWrapper from 'Component/ContentWrapper';
import { paymentMethodsType, shippingMethodsType } from 'Type/Checkout';
import CheckoutGuestForm from 'Component/CheckoutGuestForm';
import CheckoutShipping from 'Component/CheckoutShipping';
import { CHECKOUT } from 'Component/Header';
import { addressType } from 'Type/Account';
import Loader from 'Component/Loader';

import './Checkout.style';

export const SHIPPING_STEP = 'SHIPPING_STEP';
export const BILLING_STEP = 'BILLING_STEP';
export const DETAILS_STEP = 'DETAILS_STEP';

class Checkout extends PureComponent {
    static propTypes = {
        shippingMethods: shippingMethodsType.isRequired,
        onShippingEstimationFieldsChange: PropTypes.func.isRequired,
        setHeaderState: PropTypes.func.isRequired,
        paymentMethods: paymentMethodsType.isRequired,
        saveAddressInformation: PropTypes.func.isRequired,
        savePaymentInformation: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        isDeliveryOptionsLoading: PropTypes.bool.isRequired,
        shippingAddress: addressType.isRequired,
        orderID: PropTypes.string.isRequired,
        checkoutStep: PropTypes.oneOf([
            SHIPPING_STEP,
            BILLING_STEP,
            DETAILS_STEP
        ]).isRequired
    };

    stepMap = {
        [SHIPPING_STEP]: {
            title: __('1. Shipping step'),
            render: this.renderShippingStep.bind(this)
        },
        [BILLING_STEP]: {
            title: __('2. Billing step'),
            render: this.renderBillingStep.bind(this)
        },
        [DETAILS_STEP]: {
            title: __('Order details'),
            render: this.renderDetailsStep.bind(this)
        }
    };

    constructor(props) {
        super(props);

        this.updateHeader();
    }

    componentDidUpdate(prevProps) {
        const { checkoutStep } = this.props;
        const { checkoutStep: prevCheckoutStep } = prevProps;

        if (checkoutStep !== prevCheckoutStep) {
            this.updateHeader();
        }
    }

    updateHeader() {
        const { setHeaderState, checkoutStep, history } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        setHeaderState({
            name: CHECKOUT,
            title,
            onBackClick: () => history.push('/')
        });
    }

    renderTitle() {
        const { checkoutStep } = this.props;
        const { title = '' } = this.stepMap[checkoutStep];

        return (
            <h1 block="Checkout" elem="Title">
                { title }
            </h1>
        );
    }

    renderGuestForm() {
        const { checkoutStep } = this.props;
        const isBilling = checkoutStep === BILLING_STEP;

        return (
            <CheckoutGuestForm isBilling={ isBilling } />
        );
    }

    renderShippingStep() {
        const {
            shippingMethods,
            onShippingEstimationFieldsChange,
            saveAddressInformation,
            isDeliveryOptionsLoading
        } = this.props;

        return (
            <CheckoutShipping
              isLoading={ isDeliveryOptionsLoading }
              shippingMethods={ shippingMethods }
              saveAddressInformation={ saveAddressInformation }
              onShippingEstimationFieldsChange={ onShippingEstimationFieldsChange }
            />
        );
    }

    renderBillingStep() {
        const {
            paymentMethods,
            shippingAddress,
            savePaymentInformation
        } = this.props;

        return (
            <CheckoutBilling
              paymentMethods={ paymentMethods }
              shippingAddress={ shippingAddress }
              savePaymentInformation={ savePaymentInformation }
            />
        );
    }

    renderDetailsStep() {
        return ('details');
    }

    renderStep() {
        const { checkoutStep } = this.props;
        const { render } = this.stepMap[checkoutStep];
        if (render) return render();
        return null;
    }

    renderLoader() {
        const { isLoading } = this.props;
        return <Loader isLoading={ isLoading } />;
    }

    render() {
        return (
            <main block="Checkout">
                <ContentWrapper
                  wrapperMix={ { block: 'Checkout', elem: 'Wrapper' } }
                  label={ __('Checkout page') }
                >
                    <div block="Checkout" elem="Step">
                        { this.renderTitle() }
                        { this.renderGuestForm() }
                        { this.renderStep() }
                        { this.renderLoader() }
                    </div>
                </ContentWrapper>
            </main>
        );
    }
}

export default Checkout;
