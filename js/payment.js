/**
 * KPRA M-Pesa Payment Integration
 * Handles STK Push Modal and Simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Create and Append Modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="paymentModalOverlay">
            <div class="payment-modal">
                <div class="modal-header">
                    <span class="close-modal" id="closePaymentModal">&times;</span>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa Logo" style="filter: brightness(0) invert(1);">
                    <h3>M-Pesa STK Push</h3>
                </div>
                <div class="modal-body">
                    <div id="paymentInitialState">
                        <div class="payment-info">
                            <span class="item-name" id="paymentItemName">Membership Package</span>
                            <span class="amount" id="paymentAmountDisplay">KSh 7,500</span>
                        </div>
                        <form class="mpesa-form" id="mpesaStkForm">
                            <div class="form-group">
                                <label for="mpesaPhone">M-Pesa Phone Number</label>
                                <input type="tel" id="mpesaPhone" placeholder="07xxxxxxxx" required pattern="^(07|01|254)[0-9]{8}$">
                            </div>
                            <button type="submit" class="stk-btn" id="stkSubmitBtn">
                                <i class="fas fa-mobile-screen"></i> Send STK Push
                            </button>
                        </form>
                    </div>

                    <div id="paymentStatusState" class="payment-status">
                        <div id="statusIcon" class="status-icon"></div>
                        <h4 id="statusTitle" style="margin-bottom: 10px; font-weight: 800;">Processing...</h4>
                        <p id="statusDesc" style="font-size: 14px; color: var(--grey); line-height: 1.6;"></p>
                        <button id="statusCloseBtn" class="btn btn-dark" style="margin-top: 20px; display: none; width: 100%; justify-content: center;">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('paymentModalOverlay');
    const closeBtn = document.getElementById('closePaymentModal');
    const statusCloseBtn = document.getElementById('statusCloseBtn');
    const form = document.getElementById('mpesaStkForm');
    const initialState = document.getElementById('paymentInitialState');
    const statusState = document.getElementById('paymentStatusState');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusDesc = document.getElementById('statusDesc');

    // 2. Open Modal Function
    window.openPaymentModal = (itemName, amount) => {
        document.getElementById('paymentItemName').textContent = itemName;
        document.getElementById('paymentAmountDisplay').textContent = amount;
        
        // Reset state
        initialState.style.display = 'block';
        statusState.style.display = 'none';
        statusCloseBtn.style.display = 'none';
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // 3. Close Modal Logic
    const closeModal = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeModal);
    statusCloseBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    // 4. Handle Form Submission (Simulation)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('mpesaPhone').value;
        const amount = document.getElementById('paymentAmountDisplay').textContent;
        const item = document.getElementById('paymentItemName').textContent;

        // Switch to status state
        initialState.style.display = 'none';
        statusState.style.display = 'block';
        
        statusIcon.className = 'status-icon status-loading';
        statusIcon.innerHTML = '';
        statusTitle.textContent = 'Requesting STK Push...';
        statusDesc.textContent = `Please check your phone (${phone}) and enter your M-Pesa PIN for ${amount} to pay for ${item}.`;

        // Simulate M-Pesa STK Push
        setTimeout(() => {
            statusIcon.className = 'status-icon status-success';
            statusIcon.innerHTML = '<i class="fas fa-check"></i>';
            statusTitle.textContent = 'Payment Successful!';
            statusDesc.textContent = `Your payment of ${amount} for ${item} has been received. Thank you for choosing KPRA.`;
            statusCloseBtn.style.display = 'flex';
        }, 4000);
    });

    // 5. Attach event listeners to all payment triggers
    const setupPaymentButtons = () => {
        // Find buttons that look like they should trigger payment
        document.querySelectorAll('.btn-pay-mpesa').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const item = btn.getAttribute('data-item') || 'KPRA Package';
                const amount = btn.getAttribute('data-amount') || 'KSh 0';
                window.openPaymentModal(item, amount);
            });
        });

        // Special case for existing buttons that we want to override or add payment to
        // For example, in membership cards
    };

    setupPaymentButtons();
    
    // Check for URL parameters if we want to auto-open (e.g., from apply.html)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pay') === 'true') {
        const item = urlParams.get('item') || 'Membership Application';
        const amount = urlParams.get('amount') || 'KSh 2,500';
        setTimeout(() => window.openPaymentModal(item, amount), 500);
    }
});
