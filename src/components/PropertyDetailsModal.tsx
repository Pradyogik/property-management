import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../utils/cn';

interface PropertyDetailsModalProps {
  property: any;
  onClose: () => void;
}

interface DetailItemProps {
  label: string;
  value: string | number;
  className?: string;
}

const DetailItem = ({ label, value, className }: DetailItemProps) => (
  <div className={cn("border-b border-gray-200 dark:border-gray-700 py-4", className)}>
    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</div>
    <div className="text-gray-900 dark:text-white">{value}</div>
  </div>
);

interface PaymentRecord {
  installmentAmount: number;
  interestAmount: number;
  delayedInterest: number;
  date: string;
}
interface Installment {
  delayed_interest_amount: number;
  installment_interest_amount: number;
  installment_payment_amount: number;
  installment_date: string;
}

const paymentHistory: PaymentRecord[] = [
  { installmentAmount: 16682.50, interestAmount: 1997.25, delayedInterest: 0, date: '23-06-2010' },
  { installmentAmount: 16682.50, interestAmount: 1997.25, delayedInterest: 0, date: '16-09-2010' },
  { installmentAmount: 16682.50, interestAmount: 1997.25, delayedInterest: 0, date: '13-12-2010' },
  { installmentAmount: 16682.50, interestAmount: 1997.25, delayedInterest: 0, date: '16-03-2011' },
  { installmentAmount: 16682.50, interestAmount: 1997.25, delayedInterest: 0, date: '30-05-2011' },
  { installmentAmount: 49927.50, interestAmount: 5991.75, delayedInterest: 0, date: '17-06-2011' },
];


export function PropertyDetailsModal({ property, onClose }: PropertyDetailsModalProps) {
  console.log(property);
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Property Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-4rem)]">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              <DetailItem label="योजना का नाम" value={property.scheme_name || '-'} />
              <DetailItem label="Property Unique ID" value={property.property_unique_id || '-'} />
              <DetailItem label="आवंटी का नाम" value={property.allottee_name || '-'} />
              <DetailItem label="पिता/पति का नाम" value={property.fathers_husbands_name || '-'} />
              <DetailItem label="आवंटित संपत्ति की श्रेणी" value={property.property_category} />
              <DetailItem label="आवंटित संपत्ति की संख्या" value={property.property_number || '-'} />
              <DetailItem label="पंजीकरण धनराशि" value={property.registration_amount ? `₹${property.registration_amount}` : '-'} />
              <DetailItem label="पंजीकरण दिनांक" value={property.registration_date || '-'} />
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <DetailItem label="आवंटी का स्थायी पता" value={property.permanent_address || '-'} />
              <DetailItem label="आवंटी का वर्तमान पता" value={property.current_address || '-'} />
              <DetailItem label="मोबाइल नंबर" value={property.mobile_number || '-'} />
            </div>
          </div>

          {/* Financial Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DetailItem label="विक्रय मूल्य" value={`₹${property.sale_price || 0}`} />
              <DetailItem label="फ्री होल्ड धनराशि" value={`₹${property.freehold_amount || 0}`} />
              <DetailItem label="लीज रेंट की धनराशि" value={`₹${property.lease_rent_amount || 0}`} />
              <DetailItem label="पार्क चार्ज" value={`₹${property.park_charge || 0}`} />
              <DetailItem label="कार्नर चार्ज" value={`₹${property.corner_charge || 0}`} />
              <DetailItem label="अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि" value={`₹${property.remaining_sale_price_lump_sum || 0}`} />
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment History</h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">किस्त जमा धनराशि</th>
                    <th className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">किस्त जमा ब्याज धनराशि</th>
                    <th className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">विलंब ब्याज धनराशि</th>
                    <th className="bg-gray-50 dark:bg-gray-800 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">दिनांक</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {property.installments.map((installment:Installment, index:number) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">₹{installment.installment_payment_amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">₹{installment.installment_interest_amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{installment.delayed_interest_amount ? `₹${installment.delayed_interest_amount.toFixed(2)}` : '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{installment.installment_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

