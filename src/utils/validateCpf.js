export const validateCPF = (cpf) => {
    let strCPF = String(cpf).replace(/[^\d]/g, '');

    if (strCPF.length !== 11)
        return false;

    if ([
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
    ].indexOf(strCPF) !== -1)
        return false;

    let sum = 0;
    for (let i = 1; i <= 9; i++)
        sum = sum + parseInt(strCPF.substring(i - 1, i)) * (11 - i);

    let remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11))
        remainder = 0;

    if (remainder !== parseInt(strCPF.substring(9, 10)))
        return false;

    sum = 0;

    for (let i = 1; i <= 10; i++)
        sum = sum + parseInt(strCPF.substring(i - 1, i)) * (12 - i);

    remainder = (sum * 10) % 11;

    if ((remainder === 10) || (remainder === 11))
        remainder = 0;

    return remainder === parseInt(strCPF.substring(10, 11));
}
