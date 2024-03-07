export class PaymentDetails<T>{
    protected MRPCost: T;
	protected TotalAmount: T;
	protected Discounts: T;
	protected ConsultantID: T; //(ihl_consultant_id, course id)
	protected ConsultantName: T;
	protected ClassName: T;
	protected PurposeDetails: T; //(string of book appointment object, string of course object)    
	protected AppointmentID: T;
    protected AffilationUniqueName: T;
    protected SourceDevice: T;
    protected  Service_Provided: T;
    protected purpose: T;
    protected Razorpay_Order_Id: T;
    protected Razorpay_Payment_id: T;
    protected Razorpay_Signature: T;

    constructor(MRPCost: T,
        TotalAmount: T,
        Discounts: T, 
        ConsultantID: T,
        ConsultantName: T,
        ClassName: T, 
        PurposeDetails: T, 
        AppointmentID: T,
        AffilationUniqueName: T,
        SourceDevice: T,
        Service_Provided: T,
        purpose: T,
        razorpay_order_id: T, 
        razorpay_payment_id: T,
        razorpay_signature: T
        ){
        this.MRPCost = MRPCost;
        this.TotalAmount = TotalAmount;
        this.Discounts = Discounts;
        this.ConsultantID = ConsultantID;
        this.ConsultantName = ConsultantName;
        this.ClassName = ClassName;
        this.PurposeDetails = PurposeDetails;  
        this.AppointmentID = AppointmentID;
        this.AffilationUniqueName = AffilationUniqueName;
        this.SourceDevice = SourceDevice;
        this.Service_Provided = Service_Provided;
        this.purpose = purpose;
        this.Razorpay_Order_Id = razorpay_order_id;
        this.Razorpay_Payment_id = razorpay_payment_id;
        this.Razorpay_Signature = razorpay_signature;
    }
}
