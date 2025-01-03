import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { addProperty } from '../../services/api';
import { toast } from 'react-hot-toast';

interface FormStep {
  title: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
}

interface PaymentRecord {
  installmentAmount: number;
  installmentInterest: number;
  delayedInterestAmount: number;
  installmentDate: string;
}

interface ServiceChargeRecord {
  financialYear: string;
  amount: number;
  lateFee: number;
  date: string;
}

const formSteps: FormStep[] = [
  {
    title: 'Basic Information',
    fields: [
      { id: 'schemeName', label: 'योजना का नाम', type: 'text' },
      { id: 'category', label: 'आवंटित संपत्ति की श्रेणी', type: 'select', options: ['MIG', 'LIG', 'EWS'] },
      { id: 'ownerName', label: 'आवंटी का नाम', type: 'text' },
      { id: 'fatherName', label: 'पिता/पति का नाम', type: 'text' },
      { id: 'permanentAddress', label: 'आवंटी का स्थायी पता', type: 'text' },
      { id: 'currentAddress', label: 'आवंटी का वर्तमान पता', type: 'text' },
      { id: 'mobileNumber', label: 'मोबाइल नंबर', type: 'text' },
      { id: 'propertyNumber', label: 'आवंटित संपत्ति की संख्या', type: 'text' },
    ]
  },
  {
    title: 'Property Details',
    fields: [
      { id: 'registrationAmount', label: 'पंजीकरण धनराशि', type: 'number' },
      { id: 'registrationDate', label: 'पंजीकरण दिनांक', type: 'date' },
      { id: 'allotmentAmount', label: 'आवंटन धनराशि', type: 'number' },
      { id: 'allotmentDate', label: 'आवंटन दिनांक', type: 'date' },
      { id: 'salePrice', label: 'विक्रय मूल्य', type: 'number' },
      { id: 'freeholdAmount', label: 'फ्री होल्ड धनराशि', type: 'number' },
      { id: 'parkCharge', label: 'पार्क चार्ज', type: 'number' },
      { id: 'cornerCharge', label: 'कार्नर चार्ज', type: 'number' },
    ]
  },
  {
    title: 'Charges & Payments',
    fields: [
      { id: 'leaseRent', label: 'लीज रेंट की धनराशि', type: 'number' },
      { id: 'remainingSalePrice', label: 'अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि', type: 'number' },
      { id: 'remainingInstallment', label: 'अवशेष विक्रय मूल किस्त धनराशि', type: 'number' },
      { id: 'interestAmount', label: 'ब्याज धनराशि', type: 'number' },
      { id: 'remainingInstallmentDate', label: 'दिनांक', type: 'date' },
    ]
  },
  {
    title: 'Additional Details',
    fields: [
      { id: 'area', label: 'क्षेत्रफल (वर्ग मीटर)', type: 'number' },
      { id: 'possessionDate', label: 'कब्जा दिनांक', type: 'date' },
      { id: 'additionalLandAmount', label: 'अतिरिक्त भूमि की धनराशि', type: 'number' },
      { id: 'restorationCharges', label: 'पुनर्जीवित शुल्क', type: 'number' },
      { id: 'certificateCharges', label: 'प्रमाण पत्र शुल्क', type: 'number' },
    ]
  },
  {
    title: 'Service Charges',
    fields: []
  },
  {
    title: 'Payment History',
    fields: []
  }
];

interface AddPropertyFormProps {
  onClose: () => void;
}

export default function AddPropertyForm({ onClose }: AddPropertyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [serviceCharge, setServiceCharges] = useState<ServiceChargeRecord[]>([]);
  const [newPayment, setNewPayment] = useState<PaymentRecord>({
    installmentAmount: 0,
    installmentInterest: 0,
    delayedInterestAmount: 0,
    installmentDate: ''
  });
  const [newServiceCharge, setNewServiceCharge] = useState<ServiceChargeRecord>({
    financialYear: '',
    amount: 0,
    lateFee: 0,
    date: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(formSteps.length - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleAddPayment = () => {
    if (newPayment.installmentAmount && newPayment.installmentDate) {
      setPaymentHistory([...paymentHistory, newPayment]);
      setNewPayment({
        installmentAmount: 0,
        installmentInterest: 0,
        delayedInterestAmount: 0,
        installmentDate: ''
      });
    }
  };

  const handleAddServiceCharge = () => {
    if (newServiceCharge.amount && newServiceCharge.financialYear) {
      setServiceCharges([...serviceCharge, newServiceCharge]);
      setNewServiceCharge({
        financialYear: '',
        amount: 0,
        lateFee: 0,
        date: ''
      });
    }
  };

  const handleRemovePayment = (index: number) => {
    setPaymentHistory(paymentHistory.filter((_, i) => i !== index));
  };

  const handleRemoveServiceCharge = (index: number) => {
    setServiceCharges(serviceCharge.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const transformedData = {
        serialNumber: parseInt(formData.serialNumber || '0'),
        schemeName: formData.schemeName,
        propertyId: formData.propertyId,
        ownerName: formData.ownerName,
        fatherName: formData.fatherName,
        permanentAddress: formData.permanentAddress,
        currentAddress: formData.currentAddress,
        mobileNumber: formData.mobileNumber,
        category: formData.category,
        propertyNumber: parseInt(formData.propertyNumber || '0'),
        registrationAmount: parseFloat(formData.registrationAmount || '0'),
        registrationDate: formData.registrationDate,
        allotmentAmount: parseFloat(formData.allotmentAmount || '0'),
        allotmentDate: formData.allotmentDate,
        salePrice: parseFloat(formData.salePrice || '0'),
        freeholdAmount: parseFloat(formData.freeholdAmount || '0'),
        leaseRent: parseFloat(formData.leaseRent || '0'),
        parkCharge: parseFloat(formData.parkCharge || '0'),
        cornerCharge: parseFloat(formData.cornerCharge || '0'),
        remainingSalePrice: parseFloat(formData.remainingSalePrice || '0'),
        remainingInstallment: parseFloat(formData.remainingInstallment || '0'),
        interestAmount: parseFloat(formData.interestAmount || '0'),
        area_square_meter: parseFloat(formData.area || '0'),
        possession_date: formData.possessionDate,
        additional_land_amount: parseFloat(formData.additionalLandAmount || '0'),
        restoration_charges: parseFloat(formData.restorationCharges || '0'),
        certificate_charges: parseFloat(formData.certificateCharges || '0'),
        paymentHistory,
        serviceCharge
      };
      
      await addProperty(transformedData);
      toast.success('Property added successfully');
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add property. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 4) { // Service Charges step
      return (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h4 className="text-lg font-medium mb-4">Add Service Charge Record</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">वित्तीय वर्ष</label>
                <input
                  type="text"
                  value={newServiceCharge.financialYear}
                  onChange={(e) => setNewServiceCharge({
                    ...newServiceCharge,
                    financialYear: e.target.value
                  })}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">सर्विस चार्ज धनराशि</label>
                <input
                  type="number"
                  value={newServiceCharge.amount}
                  onChange={(e) => setNewServiceCharge({
                    ...newServiceCharge,
                    amount: parseFloat(e.target.value)
                  })}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">विलंब शुल्क</label>
                <input
                  type="number"
                  value={newServiceCharge.lateFee}
                  onChange={(e) => setNewServiceCharge({
                    ...newServiceCharge,
                    lateFee: parseFloat(e.target.value)
                  })}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">दिनांक</label>
                <input
                  type="date"
                  value={newServiceCharge.date}
                  onChange={(e) => setNewServiceCharge({
                    ...newServiceCharge,
                    date: e.target.value
                  })}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddServiceCharge}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Service Charge
            </button>
          </div>

          {serviceCharge.length > 0 && (
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">वित्तीय वर्ष</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">सर्विस चार्ज धनराशि</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब शुल्क</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceCharge.map((charge, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm">{charge.financialYear}</td>
                      <td className="px-6 py-4 text-sm">₹{charge.amount}</td>
                      <td className="px-6 py-4 text-sm">₹{charge.lateFee}</td>
                      <td className="px-6 py-4 text-sm">{charge.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => handleRemoveServiceCharge(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    } else if (currentStep === 5) { // Payment History step
      return (
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <h4 className="text-lg font-medium mb-4">Add Payment Record</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">किस्त जमा धनराशि</label>
                <input
                  type="number"
                  value={newPayment.installmentAmount}
                  onChange={(e) => setNewPayment({
                    ...newPayment,
                    installmentAmount: parseFloat(e.target.value)
                  })}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">किस्त जमा ब्याज धनराशि</label>
                <input
                  type="number"
                  value={newPayment.installmentInterest}
                  onChange={(e) => setNewPayment({
                    ...newPayment,
                    installmentInterest: parseFloat(e.target.value)
                  })}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">विलंब ब्याज धनराशि</label>
                <input
                  type="number"
                  value={newPayment.delayedInterestAmount}
                  onChange={(e) => setNewPayment({
                    ...newPayment,
                    delayedInterestAmount: parseFloat(e.target.value)
                  })}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">दिनांक</label>
                <input
                  type="date"
                  value={newPayment.installmentDate}
                  onChange={(e) => setNewPayment({
                    ...newPayment,
                    installmentDate: e.target.value
                  })}
                  className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddPayment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Payment
            </button>
          </div>

          {paymentHistory.length > 0 && (
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा धनराशि</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा ब्याज धनराशि</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब ब्याज धनराशि</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentHistory.map((payment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm">₹{payment.installmentAmount}</td>
                      <td className="px-6 py-4 text-sm">₹{payment.installmentInterest}</td>
                      <td className="px-6 py-4 text-sm">₹{payment.delayedInterestAmount}</td>
                      <td className="px-6 py-4 text-sm">{payment.installmentDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => handleRemovePayment(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {formSteps[currentStep].fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {field.label}
                <span className="text-red-500 dark:text-red-400 ml-1">*</span>
              </label>
              {field.type === 'select' ? (
                <select
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  value={formData[field.id] || ''}
                >
                  <option value="" className="dark:bg-gray-800">Select option...</option>
                  {field.options?.map(option => (
                    <option key={option} value={option} className="dark:bg-gray-800">{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Property Record</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Steps indicator */}
          <div className="flex justify-center mb-8">
            {formSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center relative mx-4"
                onClick={() => setCurrentStep(index)}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 border-2",
                  currentStep === index 
                    ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500" 
                    : index < currentStep
                    ? "bg-blue-50 text-blue-600 border-blue-600 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-400"
                    : "bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
                )}>
                  {index + 1}
                </div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
                  {step.title}
                </div>
                {index < formSteps.length - 1 && (
                  <div className={cn(
                    "w-20 h-0.5 mx-2 mt-4",
                    index < currentStep ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700",
                    "transition-all duration-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto px-2 mt-8 custom-scrollbar">
              {renderStepContent()}
            </div>

            <div className="mt-6 flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
                disabled={currentStep === 0}
              >
                Previous
              </button>
              {currentStep === formSteps.length - 1 ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 font-medium transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import { cn } from '../../utils/cn';
// import { addProperty } from '../../services/api';
// import { toast } from 'react-hot-toast';

// interface FormStep {
//   title: string;
//   fields: FormField[];
// }

// interface FormField {
//   id: string;
//   label: string;
//   type: 'text' | 'number' | 'date' | 'select';
//   options?: string[];
// }

// interface PaymentRecord {
//   installmentAmount: number;
//   installmentInterest: number;
//   delayedInterestAmount: number;
//   installmentDate: string;
// }

// const formSteps: FormStep[] = [
//   {
//     title: 'Basic Information',
//     fields: [
//       // { id: 'serialNumber', label: 'क्रम संख्या', type: 'number' },
//       { id: 'schemeName', label: 'योजना का नाम', type: 'text' },
//       // { id: 'propertyId', label: 'Property Unique ID', type: 'text' },
//       { id: 'category', label: 'आवंटित संपत्ति की श्रेणी', type: 'select', options: ['MIG', 'LIG', 'EWS'] },
//       { id: 'ownerName', label: 'आवंटी का नाम', type: 'text' },
//       { id: 'fatherName', label: 'पिता/पति का नाम', type: 'text' },
//       { id: 'permanentAddress', label: 'आवंटी का स्थायी पता', type: 'text' },
//       { id: 'currentAddress', label: 'आवंटी का वर्तमान पता', type: 'text' },
//       { id: 'mobileNumber', label: 'मोबाइल नंबर', type: 'text' },
//       { id: 'propertyNumber', label: 'आवंटित संपत्ति की संख्या', type: 'text' },
//     ]
//   },
//   {
//     title: 'Property Details',
//     fields: [
//       { id: 'registrationAmount', label: 'पंजीकरण धनराशि', type: 'number' },
//       { id: 'registrationDate', label: 'पंजीकरण दिनांक', type: 'date' },
//       { id: 'allotmentAmount', label: 'आवंटन धनराशि', type: 'number' },
//       { id: 'allotmentDate', label: 'आवंटन दिनांक', type: 'date' },
//       { id: 'salePrice', label: 'विक्रय मूल्य', type: 'number' },
//       { id: 'freeholdAmount', label: 'फ्री होल्ड धनराशि', type: 'number' },
//       { id: 'parkCharge', label: 'पार्क चार्ज', type: 'number' },
//       { id: 'cornerCharge', label: 'कार्नर चार्ज', type: 'number' },
//     ]
//   },
//   {
//     title: 'Charges & Payments',
//     fields: [
//       { id: 'leaseRent', label: 'लीज रेंट की धनराशि', type: 'number' },
//       { id: 'remainingSalePrice', label: 'अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि', type: 'number' },
//       { id: 'remainingInstallment', label: 'अवशेष विक्रय मूल किस्त धनराशि', type: 'number' },
//       { id: 'interestAmount', label: 'ब्याज धनराशि', type: 'number' },
//       { id: 'remainingInstallmentDate', label: 'दिनांक', type: 'date' },
//       // { id: 'installmentAmount', label: 'किस्त जमा धनराशि', type: 'number' },
//       // { id: 'installmentInterest', label: 'किस्त जमा ब्याज धनराशि', type: 'number' },
//     ]
//   },
//   {
//     title: 'Additional Details',
//     fields: [
//       { id: 'area', label: 'क्षेत्रफल (वर्ग मीटर)', type: 'number' },
//       { id: 'possessionDate', label: 'कब्जा दिनांक', type: 'date' },
//       { id: 'additionalLandAmount', label: 'अतिरिक्त भूमि की धनराशि', type: 'number' },
//       { id: 'restorationCharges', label: 'पुनर्जीवित शुल्क', type: 'number' },
//       { id: 'certificateCharges', label: 'प्रमाण पत्र शुल्क', type: 'number' },
//       { id: 'serviceChargeYear', label: 'सर्विस चार्ज वित्तीय वर्ष', type: 'text' },
//       { id: 'serviceChargeAmount', label: 'सर्विस चार्ज धनराशि', type: 'number' },
//       { id: 'serviceChargeLateAmount', label: 'सर्विस चार्ज विलंब शुल्क', type: 'number' },
//     ]
//   },
//   {
//     title: 'Payment History',
//     fields: []
//   }
// ];

// interface AddPropertyFormProps {
//   onClose: () => void;
// }

// export default function AddPropertyForm({ onClose }: AddPropertyFormProps) {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState<Record<string, string>>({});
//   const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
//   const [newPayment, setNewPayment] = useState<PaymentRecord>({
//     installmentAmount: 0,
//     installmentInterest: 0,
//     delayedInterestAmount: 0,
//     installmentDate: ''
//   });
//   console.log(newPayment, paymentHistory);
  
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (fieldId: string, value: string) => {
//     setFormData(prev => ({ ...prev, [fieldId]: value }));
//   };

//   const handleNext = () => {
//     setCurrentStep(prev => Math.min(formSteps.length - 1, prev + 1));
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prev => Math.max(0, prev - 1));
//   };

//   const handleAddPayment = () => {
//     if (newPayment.installmentAmount && newPayment.installmentDate) {
//       setPaymentHistory([...paymentHistory, newPayment]);
//       setNewPayment({
//         installmentAmount: 0,
//         installmentInterest: 0,
//         delayedInterestAmount: 0,
//         installmentDate: ''
//       });
//       console.log(newPayment, paymentHistory);
//     }
//   };

//   const handleRemovePayment = (index: number) => {
//     setPaymentHistory(paymentHistory.filter((_, i) => i !== index));
//     console.log(newPayment, paymentHistory);

//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Transform form data to match API requirements
//       const transformedData = {
//         serialNumber: parseInt(formData.serialNumber || '0'),
//         schemeName: formData.schemeName,
//         propertyId: formData.propertyId,
//         ownerName: formData.ownerName,
//         fatherName: formData.fatherName,
//         permanentAddress: formData.permanentAddress,
//         currentAddress: formData.currentAddress,
//         mobileNumber: formData.mobileNumber,
//         category: formData.category,
//         propertyNumber: parseInt(formData.propertyNumber || '0'),
//         registrationAmount: parseFloat(formData.registrationAmount || '0'),
//         registrationDate: formData.registrationDate,
//         allotmentAmount: parseFloat(formData.allotmentAmount || '0'),
//         allotmentDate: formData.allotmentDate,
//         salePrice: parseFloat(formData.salePrice || '0'),
//         freeholdAmount: parseFloat(formData.freeholdAmount || '0'),
//         leaseRent: parseFloat(formData.leaseRent || '0'),
//         parkCharge: parseFloat(formData.parkCharge || '0'),
//         cornerCharge: parseFloat(formData.cornerCharge || '0'),
//         remainingSalePrice: parseFloat(formData.remainingSalePrice || '0'),
//         remainingInstallment: parseFloat(formData.remainingInstallment || '0'),
//         interestAmount: parseFloat(formData.interestAmount || '0'),
//         installmentAmount: parseFloat(formData.installmentAmount || '0'),
//         installmentInterest: parseFloat(formData.installmentInterest || '0'),
//         area_square_meter: parseFloat(formData.area || '0'),
//         possession_date: formData.possessionDate,
//         additional_land_amount: parseFloat(formData.additionalLandAmount || '0'),
//         restoration_charges: parseFloat(formData.restorationCharges || '0'),
//         certificate_charges: parseFloat(formData.certificateCharges || '0'),
//         service_charges_financial_year: formData.serviceChargeYear,
//         service_charges_amount: parseFloat(formData.serviceChargeAmount || '0'),
//         service_charges_late_fee: parseFloat(formData.serviceChargeLateAmount || '0'),
//         paymentHistory,
//       };
      
//       await addProperty(transformedData);
//       console.log( 'addprop.tsx all post data' ,transformedData);
      
//       toast.success('Property added successfully');
//       setIsSubmitting(false);
//       onClose();
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Failed to add property. Please try again.');
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Property Record</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="p-6">
//           {/* Steps indicator */}
//           <div className="flex justify-center mb-8">
//             {formSteps.map((step, index) => (
//               <div
//                 key={index}
//                 className="flex items-center relative mx-4"
//                 onClick={() => setCurrentStep(index)}
//               >
//                 <div className={cn(
//                   "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 border-2",
//                   currentStep === index 
//                     ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500" 
//                     : index < currentStep
//                     ? "bg-blue-50 text-blue-600 border-blue-600 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-400"
//                     : "bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
//                 )}>
//                   {index + 1}
//                 </div>
//                 <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
//                   {step.title}
//                 </div>
//                 {index < formSteps.length - 1 && (
//                   <div className={cn(
//                     "w-20 h-0.5 mx-2 mt-4",
//                     index < currentStep ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700",
//                     "transition-all duration-200"
//                   )} />
//                 )}
//               </div>
//             ))}
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="max-h-[60vh] overflow-y-auto px-2 mt-8 custom-scrollbar">
//               {currentStep === 3 ? (
//                 <div className="space-y-6">
//                   <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
//                     <h4 className="text-lg font-medium mb-4">Add Payment Record</h4>
//                     <div className="grid grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-1">किस्त जमा धनराशि</label>
//                         <input
//                           type="number"
//                           value={newPayment.installmentAmount}
//                           onChange={(e) => setNewPayment({
//                             ...newPayment,
//                             installmentAmount: parseFloat(e.target.value)
//                           })}
//                           className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">किस्त जमा ब्याज धनराशि</label>
//                         <input
//                           type="number"
//                           value={newPayment.installmentInterest}
//                           onChange={(e) => setNewPayment({
//                             ...newPayment,
//                             installmentInterest: parseFloat(e.target.value)
//                           })}
//                           className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">विलंब ब्याज धनराशि</label>
//                         <input
//                           type="number"
//                           value={newPayment.delayedInterestAmount}
//                           onChange={(e) => setNewPayment({
//                             ...newPayment,
//                             delayedInterestAmount: parseFloat(e.target.value)
//                           })}
//                           className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">दिनांक</label>
//                         <input
//                           type="date"
//                           value={newPayment.installmentDate}
//                           onChange={(e) => setNewPayment({
//                             ...newPayment,
//                             installmentDate: e.target.value
//                           })}
//                           className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={handleAddPayment}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                     >
//                       Add Payment
//                     </button>
//                   </div>

//                   {paymentHistory.length > 0 && (
//                     <div className="overflow-x-auto rounded-lg border">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा धनराशि</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">किस्त जमा ब्याज धनराशि</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">विलंब ब्याज धनराशि</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">दिनांक</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500"></th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {paymentHistory.map((payment, index) => (
//                             <tr key={index}>
//                               <td className="px-6 py-4 text-sm">₹{payment.installmentAmount}</td>
//                               <td className="px-6 py-4 text-sm">₹{payment.installmentInterest}</td>
//                               <td className="px-6 py-4 text-sm">₹{payment.delayedInterestAmount}</td>
//                               <td className="px-6 py-4 text-sm">{payment.installmentDate}</td>
//                               <td className="px-6 py-4 text-sm">
//                                 <button
//                                   type="button"
//                                   onClick={() => handleRemovePayment(index)}
//                                   className="text-red-600 hover:text-red-700"
//                                 >
//                                   Remove
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 gap-x-6 gap-y-4">
//                   {formSteps[currentStep].fields.map((field) => (
//                     <div key={field.id}>
//                       <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
//                         {field.label}
//                         <span className="text-red-500 dark:text-red-400 ml-1">*</span>
//                       </label>
//                       {field.type === 'select' ? (
//                         <select
//                           className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
//                           onChange={(e) => handleInputChange(field.id, e.target.value)}
//                           value={formData[field.id] || ''}
//                         >
//                           <option value="" className="dark:bg-gray-800">Select option...</option>
//                           {field.options?.map(option => (
//                             <option key={option} value={option} className="dark:bg-gray-800">{option}</option>
//                           ))}
//                         </select>
//                       ) : (
//                         <input
//                           type={field.type}
//                           className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
//                           placeholder={`Enter ${field.label.toLowerCase()}`}
//                           value={formData[field.id] || ''}
//                           onChange={(e) => handleInputChange(field.id, e.target.value)}
//                         />
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="mt-6 flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
//               <button
//                 type="button"
//                 onClick={handlePrevious}
//                 className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
//                 disabled={currentStep === 0}
//               >
//                 Previous
//               </button>
//               {currentStep === formSteps.length - 1 ? (
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 font-medium transition-colors"
//                 >
//                   {isSubmitting ? 'Submitting...' : 'Submit'}
//                 </button>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={handleNext}
//                   className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors"
//                 >
//                   Next
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// // old code
// // import React, { useState } from 'react';
// // import { X } from 'lucide-react';
// // import { cn } from '../../utils/cn';
// // import { addProperty } from '../../services/api';
// // import { toast } from 'react-hot-toast';

// // interface FormStep {
// //   title: string;
// //   fields: FormField[];
// // }

// // interface FormField {
// //   id: string;
// //   label: string;
// //   type: 'text' | 'number' | 'date' | 'select';
// //   options?: string[];
// // }

// // const formSteps: FormStep[] = [
// //   {
// //     title: 'Basic Information',
// //     fields: [
// //       // { id: 'serialNumber', label: 'क्रम संख्या', type: 'number' },
// //       { id: 'schemeName', label: 'योजना का नाम', type: 'text' },
// //       { id: 'category', label: 'आवंटित संपत्ति की श्रेणी', type: 'select', options: ['MIG', 'LIG', 'EWS'] },
// //       // { id: 'propertyId', label: 'Property Unique ID', type: 'text' },
// //       { id: 'ownerName', label: 'आवंटी का नाम', type: 'text' },
// //       { id: 'fatherName', label: 'पिता/पति का नाम', type: 'text' },
// //       { id: 'permanentAddress', label: 'आवंटी का स्थायी पता', type: 'text' },
// //       { id: 'currentAddress', label: 'आवंटी का वर्तमान पता', type: 'text' },
// //       { id: 'mobileNumber', label: 'मोबाइल नंबर', type: 'text' },
// //       { id: 'propertyNumber', label: 'आवंटित संपत्ति की संख्या', type: 'text' },
// //     ]
// //   },
// //   {
// //     title: 'Property Details',
// //     fields: [
// //       { id: 'registrationAmount', label: 'पंजीकरण धनराशि', type: 'number' },
// //       { id: 'registrationDate', label: 'पंजीकरण दिनांक', type: 'date' },
// //       { id: 'allotmentAmount', label: 'आवंटन धनराशि', type: 'number' },
// //       { id: 'allotmentDate', label: 'आवंटन दिनांक', type: 'date' },
// //       { id: 'salePrice', label: 'विक्रय मूल्य', type: 'number' },
// //       { id: 'freeholdAmount', label: 'फ्री होल्ड धनराशि', type: 'number' },
// //       { id: 'parkCharge', label: 'पार्क चार्ज', type: 'number' },
// //       { id: 'cornerCharge', label: 'कार्नर चार्ज', type: 'number' },
// //     ]
// //   },
// //   {
// //     title: 'Charges & Payments',
// //     fields: [
// //       { id: 'leaseRent', label: 'लीज रेंट की धनराशि', type: 'number' },
// //       { id: 'remainingSalePrice', label: 'अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि', type: 'number' },
// //       { id: 'remainingInstallment', label: 'अवशेष विक्रय मूल किस्त धनराशि', type: 'number' },
// //       { id: 'interestAmount', label: 'ब्याज धनराशि', type: 'number' },
// //       { id: 'installmentAmount', label: 'किस्त जमा धनराशि', type: 'number' },
// //       { id: 'installmentInterest', label: 'किस्त जमा ब्याज धनराशि', type: 'number' },
// //     ]
// //   },
// //   {
// //     title: 'Additional Details',
// //     fields: [
// //       { id: 'area', label: 'क्षेत्रफल (वर्ग मीटर)', type: 'number' },
// //       { id: 'possessionDate', label: 'कब्जा दिनांक', type: 'date' },
// //       { id: 'additionalLandAmount', label: 'अतिरिक्त भूमि की धनराशि', type: 'number' },
// //       { id: 'restorationCharges', label: 'पुनर्जीवित शुल्क', type: 'number' },
// //       { id: 'certificateCharges', label: 'प्रमाण पत्र शुल्क', type: 'number' },
// //       { id: 'serviceChargeYear', label: 'सर्विस चार्ज वित्तीय वर्ष', type: 'text' },
// //       { id: 'serviceChargeAmount', label: 'सर्विस चार्ज धनराशि', type: 'number' },
// //       { id: 'serviceChargeLateAmount', label: 'सर्विस चार्ज विलंब शुल्क', type: 'number' },
// //     ]
// //   }
// // ];

// // interface AddPropertyFormProps {
// //   onClose: () => void;
// // }

// // export default function AddPropertyForm({ onClose }: AddPropertyFormProps) {
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [formData, setFormData] = useState<Record<string, string>>({});
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const handleInputChange = (fieldId: string, value: string) => {
// //     setFormData(prev => ({ ...prev, [fieldId]: value }));
// //   };

// //   const handleNext = () => {
// //     setCurrentStep(prev => Math.min(formSteps.length - 1, prev + 1));
// //   };

// //   const handlePrevious = () => {
// //     setCurrentStep(prev => Math.max(0, prev - 1));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);

// //     try {
// //       // Transform form data to match API requirements
// //       const transformedData = {
// //         serialNumber: parseInt(formData.serialNumber || '0'),
// //         schemeName: formData.schemeName,
// //         propertyId: formData.propertyId,
// //         ownerName: formData.ownerName,
// //         fatherName: formData.fatherName,
// //         permanentAddress: formData.permanentAddress,
// //         currentAddress: formData.currentAddress,
// //         mobileNumber: formData.mobileNumber,
// //         category: formData.category,
// //         propertyNumber: parseInt(formData.propertyNumber || '0'),
// //         registrationAmount: parseFloat(formData.registrationAmount || '0'),
// //         registrationDate: formData.registrationDate,
// //         allotmentAmount: parseFloat(formData.allotmentAmount || '0'),
// //         allotmentDate: formData.allotmentDate,
// //         salePrice: parseFloat(formData.salePrice || '0'),
// //         freeholdAmount: parseFloat(formData.freeholdAmount || '0'),
// //         leaseRent: parseFloat(formData.leaseRent || '0'),
// //         parkCharge: parseFloat(formData.parkCharge || '0'),
// //         cornerCharge: parseFloat(formData.cornerCharge || '0'),
// //         remainingSalePrice: parseFloat(formData.remainingSalePrice || '0'),
// //         remainingInstallment: parseFloat(formData.remainingInstallment || '0'),
// //         interestAmount: parseFloat(formData.interestAmount || '0'),
// //         installmentAmount: parseFloat(formData.installmentAmount || '0'),
// //         installmentInterest: parseFloat(formData.installmentInterest || '0'),
// //         area_square_meter: parseFloat(formData.area || '0'),
// //         possession_date: formData.possessionDate,
// //         additional_land_amount: parseFloat(formData.additionalLandAmount || '0'),
// //         restoration_charges: parseFloat(formData.restorationCharges || '0'),
// //         certificate_charges: parseFloat(formData.certificateCharges || '0'),
// //         service_charges_financial_year: formData.serviceChargeYear,
// //         service_charges_amount: parseFloat(formData.serviceChargeAmount || '0'),
// //         service_charges_late_fee: parseFloat(formData.serviceChargeLateAmount || '0'),
// //       };
      
// //       await addProperty(transformedData);
// //       toast.success('Property added successfully');
// //       setIsSubmitting(false);
// //       onClose();
// //     } catch (error) {
// //       console.error('Error submitting form:', error);
// //       toast.error('Failed to add property. Please try again.');
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
// //       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
// //         <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
// //           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Property Record</h2>
// //           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
// //             <X className="h-5 w-5" />
// //           </button>
// //         </div>

// //         <div className="p-6">
// //           {/* Steps indicator */}
// //           <div className="flex justify-center mb-8">
// //             {formSteps.map((step, index) => (
// //               <div
// //                 key={index}
// //                 className="flex items-center relative mx-4"
// //                 onClick={() => setCurrentStep(index)}
// //               >
// //                 <div className={cn(
// //                   "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 border-2",
// //                   currentStep === index 
// //                     ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500" 
// //                     : index < currentStep
// //                     ? "bg-blue-50 text-blue-600 border-blue-600 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-400"
// //                     : "bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600"
// //                 )}>
// //                   {index + 1}
// //                 </div>
// //                 <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
// //                   {step.title}
// //                 </div>
// //                 {index < formSteps.length - 1 && (
// //                   <div className={cn(
// //                     "w-20 h-0.5 mx-2 mt-4",
// //                     index < currentStep ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-200 dark:bg-gray-700",
// //                     "transition-all duration-200"
// //                   )} />
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           <form onSubmit={handleSubmit}>
// //             <div className="max-h-[60vh] overflow-y-auto px-2 mt-8 custom-scrollbar">
// //               <div className="grid grid-cols-2 gap-x-6 gap-y-4">
// //                 {formSteps[currentStep].fields.map((field) => (
// //                   <div key={field.id}>
// //                     <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1">
// //                       {field.label}
// //                       <span className="text-red-500 dark:text-red-400 ml-1">*</span>
// //                     </label>
// //                     {field.type === 'select' ? (
// //                       <select
// //                         className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
// //                         onChange={(e) => handleInputChange(field.id, e.target.value)}
// //                         value={formData[field.id] || ''}
// //                       >
// //                         <option value="" className="dark:bg-gray-800">Select option...</option>
// //                         {field.options?.map(option => (
// //                           <option key={option} value={option} className="dark:bg-gray-800">{option}</option>
// //                         ))}
// //                       </select>
// //                     ) : (
// //                       <input
// //                         type={field.type}
// //                         className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-0 transition-colors text-sm"
// //                         placeholder={`Enter ${field.label.toLowerCase()}`}
// //                         value={formData[field.id] || ''}
// //                         onChange={(e) => handleInputChange(field.id, e.target.value)}
// //                       />
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             <div className="mt-6 flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
// //               <button
// //                 type="button"
// //                 onClick={handlePrevious}
// //                 className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
// //                 disabled={currentStep === 0}
// //               >
// //                 Previous
// //               </button>
// //               {currentStep === formSteps.length - 1 ? (
// //                 <button
// //                   type="submit"
// //                   disabled={isSubmitting}
// //                   className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 font-medium transition-colors"
// //                 >
// //                   {isSubmitting ? 'Submitting...' : 'Submit'}
// //                 </button>
// //               ) : (
// //                 <button
// //                   type="button"
// //                   onClick={handleNext}
// //                   className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors"
// //                 >
// //                   Next
// //                 </button>
// //               )}
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }