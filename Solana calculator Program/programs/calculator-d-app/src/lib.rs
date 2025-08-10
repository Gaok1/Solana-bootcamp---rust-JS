use anchor_lang::prelude::*;

declare_id!("2xUPde64EmxLoDBMx8nfBPYAUwT3DfjGPjz6L9qoAJBF");

#[program]
pub mod calculator_d_app {
    use anchor_lang::solana_program::entrypoint::ProgramResult;

    use super::*;

    pub fn create(ctx: Context<Create>, init_message: String) -> ProgramResult {
        let calct = &mut ctx.accounts.calculator;
        calct.message = init_message;
        ProgramResult::Ok(())
    }

    pub fn add(ctx: Context<CalculatorOperation>, op1:i64, op2:i64) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        calculator.message = "Addition performed".to_string();
        calculator.result = op1 + op2;
        calculator.remainder = 0; 
        msg!("Addition performed: {} + {}", op1, op2);
        msg!("ctx = {:?}", calculator);
        ProgramResult::Ok(())
    }

    pub fn divide(ctx: Context<CalculatorOperation>, op1:i64, op2:i64) -> ProgramResult {
        let calculator = &mut ctx.accounts.calculator;
        if op2 == 0 {
            calculator.message = "Division by zero is not allowed".to_string();
            return Err(ProgramError::InvalidArgument); 
        }
        calculator.message = "Division performed".to_string();
        calculator.result = op1 / op2;
        calculator.remainder = op1 % op2; // Calcula o resto da divisão
        ProgramResult::Ok(())
    }
}

#[derive(Accounts)] //deriva o trait Accounts que serve para serialiar os dados da conta?
pub struct Create<'info> {
    #[account(
        init,
        payer = user, 
        space = 256
    )] // (init) cria uma calculadora ao inicializar o programa, (payer) quem paga a conta, (space) espaço alocado para a conta
    pub calculator: Account<'info, Calculator>, 

    #[account(mut)] // n entendi
    pub user: Signer<'info>, 

    pub system_program: Program<'info, System>, // programa do sistema que permite criar contas
}

#[derive(Accounts)]
pub struct CalculatorOperation<'info> {
    #[account(mut)] //modificara a conta
    pub calculator: Account<'info, Calculator>, // conta que será modificada
}


#[account] //define a estrutura da conta
#[derive(Debug)]
pub struct Calculator {
    pub message: String,
    pub result: i64,
    pub remainder: i64,
}