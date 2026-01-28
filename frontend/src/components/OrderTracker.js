import React from 'react';
import { FiCheck, FiPackage, FiTruck, FiHome, FiClock, FiXCircle } from 'react-icons/fi';

const OrderTracker = ({ status, createdAt }) => {
    const steps = [
        { id: 'pending', label: 'Order Placed', icon: FiClock },
        { id: 'processing', label: 'Processing', icon: FiPackage },
        { id: 'shipped', label: 'Shipped', icon: FiTruck },
        { id: 'delivered', label: 'Delivered', icon: FiHome },
    ];

    // Determine current step index
    let currentStep = 0;
    if (status === 'cancelled') {
        currentStep = -1; // Special case
    } else {
        currentStep = steps.findIndex((step) => step.id === status);
        // If status is not found (e.g. legacy data), default to 0
        if (currentStep === -1) currentStep = 0;
    }

    if (status === 'cancelled') {
        return (
            <div className="w-full py-6">
                <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-6 flex items-center gap-6 text-red-500">
                    <div className="p-4 bg-red-500/10 rounded-full">
                        <FiXCircle size={32} />
                    </div>
                    <div>
                        <h4 className="font-black text-xl uppercase tracking-tighter">Protocol Aborted</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                            This acquisition has been terminated.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-12">
            <div className="relative flex flex-col md:flex-row justify-between items-center w-full gap-8 md:gap-0">
                {/* Progress Bar Background (Desktop) */}
                <div className="hidden md:block absolute top-[24px] left-0 w-full h-[1px] bg-white/5 -z-10" />

                {/* Active Progress Bar (Desktop) */}
                <div
                    className="hidden md:block absolute top-[24px] left-0 h-[1px] bg-orange-500 -z-10 transition-all duration-1000 ease-in-out"
                    style={{
                        width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    }}
                />

                {/* Steps */}
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div
                            key={step.id}
                            className={`flex flex-col items-center gap-4 relative z-10 ${isCompleted ? 'text-white' : 'text-white/20'
                                }`}
                        >
                            {/* Icon Circle */}
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-700 ${isCompleted
                                    ? 'bg-[#0A0A0A] border-orange-500 shadow-[0_0_20px_rgba(255,77,0,0.2)]'
                                    : 'bg-[#0A0A0A] border-white/5'
                                    } ${isCurrent ? 'scale-125' : 'scale-100'}`}
                            >
                                {index < currentStep ? (
                                    <FiCheck size={18} className="text-orange-500" />
                                ) : (
                                    <Icon
                                        size={18}
                                        className={isCompleted ? 'text-orange-500' : 'text-white/20'}
                                    />
                                )}
                            </div>

                            {/* Label */}
                            <div className="text-center">
                                <p
                                    className={`font-black text-[10px] uppercase tracking-[0.2em] ${isCompleted ? 'text-white' : 'text-white/20'
                                        }`}
                                >
                                    {step.label}
                                </p>
                                {index === 0 && createdAt && (
                                    <p className="text-[8px] font-black text-white/10 uppercase tracking-widest mt-1">
                                        {new Date(createdAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTracker;
