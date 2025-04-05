
import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee, CalendarClock, Percent, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from "@/components/ui/use-toast";

interface MortgageRate {
  bank: string;
  rate: number;
  min_loan_amount?: number;
  max_loan_amount?: number;
  processing_fee?: number;
}

export const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [currentRates, setCurrentRates] = useState<MortgageRate[]>([
    { bank: "SBI", rate: 8.5 },
    { bank: "HDFC", rate: 8.7 },
    { bank: "ICICI", rate: 8.6 },
    { bank: "Axis Bank", rate: 8.9 },
    { bank: "Kotak Mahindra", rate: 8.75 }
  ]);
  
  useEffect(() => {
    const fetchCurrentRates = async () => {
      //implement fetching from mongodb in bellow code 
      // try {
      //   const { data, error } = await 
      //     .from('mortgage_rates')
      //     .select('bank, rate, min_loan_amount, max_loan_amount, processing_fee')
      //     .order('bank', { ascending: true });
          
      //   if (error) throw error;
        
      //   if (data && data.length > 0) {
      //     setCurrentRates(data);
      //     setInterestRate(data[0].rate);
      //   }
      // } catch (error) {
      //   console.error('Error fetching current rates:', error);
      // }
    };
    
    fetchCurrentRates();
  }, []);
  
  useEffect(() => {
    const loanAmount = homePrice - downPayment;
    const monthlyInterest = interestRate / 100 / 12;
    const months = loanTerm * 12;
    
    if (loanAmount <= 0 || monthlyInterest <= 0 || months <= 0) {
      setMonthlyPayment(0);
      return;
    }
    
    const payment = loanAmount * 
                    (monthlyInterest * Math.pow(1 + monthlyInterest, months)) / 
                    (Math.pow(1 + monthlyInterest, months) - 1);
    
    setMonthlyPayment(payment);
  }, [homePrice, downPayment, loanTerm, interestRate]);
  
  const handleHomePriceChange = (value: string) => {
    const newHomePrice = Number(value) || 0;
    setHomePrice(newHomePrice);
    setDownPayment((downPaymentPercent / 100) * newHomePrice);
  };
  
  const handleDownPaymentChange = (value: string) => {
    const newDownPayment = Number(value) || 0;
    setDownPayment(newDownPayment);
    setDownPaymentPercent((newDownPayment / homePrice) * 100);
  };
  
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    setDownPaymentPercent(percent);
    setDownPayment((percent / 100) * homePrice);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const applyForLoan = async () => {
  //   try {
  //     // const { data: session } = await auth.getSession();
      
  //     if (!session || !session.session) {
  //       toast({
  //         title: "Login Required",
  //         description: "Please login to apply for a home loan.",
  //         variant: "destructive"
  //       });
  //       return;
  //     }
      
  //     const { error } = await 
  //       .from('loan_applications')
  //       .insert({
  //         user_id: session.session.user.id,
  //         loan_amount: homePrice - downPayment,
  //         property_value: homePrice,
  //         down_payment: downPayment,
  //         interest_rate: interestRate,
  //         loan_term_years: loanTerm
  //       });
        
  //     if (error) throw error;
      
  //     toast({
  //       title: "Application Submitted",
  //       description: "Your loan application has been submitted successfully!",
  //     });
  //   } catch (error) {
  //     console.error('Error submitting loan application:', error);
  //     toast({
  //       title: "Application Failed",
  //       description: "There was an error submitting your application. Please try again.",
  //       variant: "destructive"
  //     });
  //   }
  // };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calculator className="h-4 w-4" />
          Home Loan Calculator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" />
            Home Loan Calculator
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="homePrice" className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                Property Value
              </Label>
              <Input
                id="homePrice"
                type="number"
                value={homePrice}
                onChange={(e) => handleHomePriceChange(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="downPayment" className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                Down Payment ({downPaymentPercent.toFixed(0)}%)
              </Label>
              <Input
                id="downPayment"
                type="number"
                value={downPayment}
                onChange={(e) => handleDownPaymentChange(e.target.value)}
                className="col-span-3"
              />
              <Slider
                value={[downPaymentPercent]}
                min={10}
                max={50}
                step={1}
                onValueChange={handleDownPaymentPercentChange}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="loanTerm" className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                Loan Term (Years)
              </Label>
              <div className="flex space-x-2">
                {[10, 15, 20, 30].map((term) => (
                  <Button
                    key={term}
                    type="button"
                    variant={loanTerm === term ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLoanTerm(term)}
                    className="flex-1"
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="interestRate" className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                Interest Rate
              </Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    step="0.1"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Current rates: {currentRates.map((bank, idx) => (
                    <Button 
                      key={bank.bank} 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-xs font-normal underline"
                      onClick={() => setInterestRate(bank.rate)}
                    >
                      {bank.bank} ({bank.rate}%){idx < currentRates.length - 1 ? ', ' : ''}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/50 p-4 rounded-lg mt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Loan Amount</h4>
                <p className="text-lg font-bold">{formatCurrency(homePrice - downPayment)}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Monthly EMI</h4>
                <p className="text-2xl font-bold text-accent">{formatCurrency(monthlyPayment)}</p>
              </div>
            </div>
          </div>
          
          <Button onClick={applyForLoan} className="w-full mt-2">
            Apply for Home Loan
          </Button>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p>
              This calculator provides an estimate only and should not be considered
              financial advice. Interest rates may vary based on credit score and bank policies.
              Consult with a financial professional for accurate information.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
};
export default MortgageCalculator;
