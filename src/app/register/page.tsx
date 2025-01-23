import { FC } from 'react';
import RegisterForm from '@/components/RegisterForm';

const RegisterPage: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col">
      <div className="w-full pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <a className="text-[3rem] font-aeonik font-black relative">
              WAIB
              <div className="absolute -top-2 -right-12 px-2.5 py-[3px] flex items-center bg-white/[0.05] backdrop-blur-sm border border-white/[0.05] rounded-md" style={{ boxShadow: 'rgba(209, 243, 74, 0.043) 0px 0px 1.72849px' }}>
                <span className="text-[14px] font-aeonik font-normal text-primary leading-[1]">3.0</span>
              </div>
            </a>
            <div className="bg-primary text-black text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
              Premium
            </div>
          </div>
        </div>
      </div>

      <div className="flex-[0.5_1_0%] flex items-center justify-center -mt-20">
        <div className="w-full max-w-md px-4">
          <h2 className="text-center text-3xl font-extrabold text-white mb-8">
            Inscription
          </h2>
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 