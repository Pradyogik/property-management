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
      // { id: 'schemeName', label: 'योजना का नाम', type: 'text' },
      { id: 'schemeName', label: 'योजना का नाम', type: 'select', options: ['hariyanv', 'bidamart', 'pipris'] },
      { id: 'propertyCategory', label: 'आवंटित संपत्ति की श्रेणी', type: 'select', options: ['MIG', 'LIG', 'EWS'] },
      { id: 'allotteName', label: 'आवंटी का नाम', type: 'text' },
      { id: 'fatherHusbandName', label: 'पिता/पति का नाम', type: 'text' },
      { id: 'permanentAddress', label: 'आवंटी का स्थायी पता', type: 'text' },
      { id: 'currentAddress', label: 'आवंटी का वर्तमान पता', type: 'text' },
      { id: 'mobileNumber', label: 'मोबाइल नंबर', type: 'text' },
      { id: 'propertyNumber', label: 'आवंटित संपत्ति की संख्या', type: 'number' },
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
      { id: 'leaseRentAmount', label: 'लीज रेंट की धनराशि', type: 'number' },
      { id: 'remainingSalePriceLumpSum', label: 'अवशेष विक्रय मूल्य एकमुश्त जमा धनराशि', type: 'number' },
      { id: 'remainingSalePriceInstallment', label: 'अवशेष विक्रय मूल किस्त धनराशि', type: 'number' },
      { id: 'interestAmount', label: 'ब्याज धनराशि', type: 'number' },
      { id: 'remainingInstallmentDate', label: 'दिनांक', type: 'date' },
      { id: 'areaSquareMeter', label: 'क्षेत्रफल (वर्ग मीटर)', type: 'number' },
      { id: 'possessionDate', label: 'कब्जा दिनांक', type: 'date' },
      { id: 'additionalLandAmount', label: 'अतिरिक्त भूमि की धनराशि', type: 'number' },
      { id: 'restorationCharges', label: 'पुनर्जीवित शुल्क', type: 'number' },
      { id: 'certificateCharges', label: 'प्रमाण पत्र शुल्क', type: 'number' },
    ]
  },
  {
    title: 'Payment History',
    fields: []
  },
  {
    title: 'Additional Details',
    fields: [
      { id: 'registrationCharges', label: 'निबंधन शुल्क', type: 'number' },
      { id: 'registrationDate2', label: 'निबंधन दिनांक', type: 'date' },
      { id: 'transferName', label: 'नामंतारी का नाम', type: 'text' },
      { id: 'transferorFatherHusbandName', label: 'नामंतारी के पिता/पति का नाम', type: 'text' },
      { id: 'transferorAddress', label: 'पता', type: 'text' },
      { id: 'inheritance', label: 'वरासत', type: 'text' },
      { id: 'transferCharges', label: 'नामांतरण शुल्क', type: 'number' },
      { id: 'documentationCharges', label: 'डॉक्यूमेंटेशन शुल्क', type: 'number' },
      { id: 'transferDate', label: 'नामांतरण दिनांक', type: 'date' },
      { id: 'buildingPlanApprovalDate', label: 'भवन मानचित्र स्वीकृति दिनांक', type: 'date' },
      { id: 'buildingConstruction', label: 'भवन निर्माण (हां/नहीं)', type: 'text' },
      { id: 'depositDateReceiptNumber', label: 'जमा धनराशि दिनांक व रसीद संख्या', type: 'date' },
      { id: 'changeFee', label: 'परिवर्तन शुल्क', type: 'number' },
      { id: 'advertisementFee', label: 'विज्ञापन शुल्क', type: 'number' },
    ]
  },
  {
    title: 'Service Charges',
    fields: []
  },
  
  
];

interface AddPropertyFormProps {
  onClose: () => void;
}

export default function AddPropertyForm({ onClose }: AddPropertyFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [serviceChargeHistory, setServiceChargeHistory] = useState<ServiceChargeRecord[]>([]);
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
    if (newServiceCharge.financialYear && newServiceCharge.amount && newServiceCharge.date) {
      setServiceChargeHistory([...serviceChargeHistory, newServiceCharge]);
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
    setServiceChargeHistory(serviceChargeHistory.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     
  // Only proceed if we have at least one payment record
  if (serviceChargeHistory.length === 0) {
    // toast.error('Please add at least one payment record');
    return;
  }
  setIsSubmitting(true);

    try {
      const transformedData = {
        serialNumber: parseInt(formData.serialNumber || '0'),
        schemeName: formData.schemeName,
        // propertyId: formData.propertyId,
        allotteName: formData.allotteName,
        fatherHusbandName: formData.fatherHusbandName,
        permanentAddress: formData.permanentAddress,
        currentAddress: formData.currentAddress,
        mobileNumber: formData.mobileNumber,
        propertyCategory: formData.propertyCategory,
        propertyNumber: parseInt(formData.propertyNumber || '0'),
        registrationAmount: parseFloat(formData.registrationAmount || '0'),
        registrationDate: formData.registrationDate,
        allotmentAmount: parseFloat(formData.allotmentAmount || '0'),
        allotmentDate: formData.allotmentDate,
        salePrice: parseFloat(formData.salePrice || '0'),
        freeholdAmount: parseFloat(formData.freeholdAmount || '0'),
        leaseRentAmount: parseFloat(formData.leaseRentAmount || '0'),
        parkCharge: parseFloat(formData.parkCharge || '0'),
        cornerCharge: parseFloat(formData.cornerCharge || '0'),
        remainingSalePriceLumpSum: parseFloat(formData.remainingSalePriceLumpSum || '0'),
        remainingSalePriceInstallment: parseFloat(formData.remainingSalePriceInstallment || '0'),
        interestAmount: parseFloat(formData.interestAmount || '0'),
        areaSquareMeter: parseFloat(formData.areaSquareMeter || '0'),
        possessionDate: formData.possessionDate,
        additionalLandAmount: parseFloat(formData.additionalLandAmount || '0'),
        restorationCharges: parseFloat(formData.restorationCharges || '0'),
        certificateCharges: parseFloat(formData.certificateCharges || '0'),
        paymentHistory,
        registrationCharges: parseFloat(formData.registrationCharges || '0'),
        registrationDate2 : formData.registrationDate2,
        transferName : formData.transferName,
        transferorFatherHusbandName: formData.transferorFatherHusbandName,
        transferorAddress : formData.transferorAddress,
        inheritance: formData.inheritance,
        transferCharges : parseFloat(formData.transferCharges || '0'),
        documentationCharges : parseFloat(formData.documentationCharges || '0'),
        transferDate : formData.transferDate,
        buildingPlanApprovalDate : formData.buildingPlanApprovalDate,
        buildingConstruction : formData.buildingConstruction,
        depositDateReceiptNumber: formData.depositDateReceiptNumber,
        changeFee: parseFloat(formData.changeFee || '0'),
        advertisementFee: parseFloat(formData.advertisementFee || '0'),
        serviceChargeHistory,
      };
      
      console.log('data is going properly in add property before', transformedData);
      await addProperty(transformedData);
      console.log('data is going properly in add property after', transformedData);
      toast.success('Property added successfully');
      setIsSubmitting(false);
      onClose();
      
    } catch (error:any) {
      console.log('Error submitting form:', error.message);
      toast.error('Failed to add property. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderServiceChargeStep = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-">
        <h4 className="text-lg font-medium mb-4">Add Service Charge</h4>
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

      {serviceChargeHistory.length > 0 && (
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
              {serviceChargeHistory.map((charge, index) => (
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

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Property Record</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
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
              {currentStep === 5 ? (
                renderServiceChargeStep()
              ) : currentStep === 3 ? (
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
              ) : (
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
              )}
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
