import axios from 'axios';
import { BASE_URL } from './../Constant/constant';
import promiseMiddleware from 'redux-promise';

export const VALIDATE_EXP = 'VALIDATE_EXP';

export function actionValidateExp(tableName, businessDate, sampleSize, columns, expression, attr) {
    const url = BASE_URL + "business-rule/validate-python-expr";
    console.log(url);
    console.log('Table Name: ', tableName);
    console.log('Business Date: ', businessDate);
    console.log('Sample Size: ', sampleSize);
    console.log('Columns: ', columns.toString());
    console.log('Expression: ', expression);
    console.log('attr:',attr);
    const resultFormat = {
        expr: expression,
        attr: attr,
        sample: {
            table_name: tableName,
            business_date: businessDate,
            sample_size: sampleSize,
            columns: columns.toString()
        }
    };
    // for (let i = 0; i < columns.length; i++)
    //     resultFormat.attr[columns[i]] = '';
    const request = axios.post(url, resultFormat);
    return {
        type: VALIDATE_EXP,
        payload: request
    };
}
