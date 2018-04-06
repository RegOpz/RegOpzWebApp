import axios from 'axios';
import {store} from '../reducers';

export default function(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

export function setTenantDetail(domainInfo){
  console.log("Inside setTenantDetail",domainInfo);
  if(domainInfo){
    axios.defaults.headers.common['Tenant'] = domainInfo;
  } else {
    delete axios.defaults.headers.common['Tenant'];
  }

}
