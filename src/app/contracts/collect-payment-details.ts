export interface CollectPaymentDetails<T> {
    (MRPCost: T, TotalAmount: T, Discounts: T, ConsultantID: T, ConsultantName: T, ClassName: T, PurposeDetails: T, AppointmentID: T, AffilationUniqueName: T, SourceDevice: T): void;
}
