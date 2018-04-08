import { combineReducers,createStore} from 'redux';
import { reducer as formReducer } from 'redux-form';
import businessRulesReducer from './BusinessRulesReducer';
import ReportLinkageReducer from './ReportLinkageReducer';
import CapturedReportReducer from './CapturedReportReducer';
import ViewDataReducer from './ViewDataReducer';
import ReportReducer from './ReportReducer';
import SourceReducer from './SourceReducer';
import MaintainReportRulesReducer from './MaintainReportRulesReducer';
import MaintainSourcesReducer from './MaintainSourcesReducer';
import VarianceAnalysisReducer from './VarianceAnalysisReducer';
import CreateReportReducer from './CreateReportReducer';
import UsersReducer from './UsersReducer';
import TenantsReducer from './TenantsReducer';
import LoginReducer from './LoginReducer';
import DefChangeReducer from './DefChangeReducer';
import DataChangeReducer from './DataChangeReducer';
import RolesReducer from './RolesReducer';
import RuleAssistReducer from './RuleAssistReducer';
import { userDetailsReducer, apiDetailsReducer } from './CustomizeDashReducer';
import LeftMenuReducer from './LeftMenuReducer';
import LoadDataReducer from './LoadDataReducer';
import DisplayMessageReducer from './MiddleWareReducer';
import CaptureTemplateReducer from './CaptureReportTemplateReducer';
import TransactionReportReducer from './TransactionReportReducer';

const rootReducer = combineReducers({
  user_details: UsersReducer,
  tenant_details: TenantsReducer,
  business_rules: businessRulesReducer,
  report_linkage: ReportLinkageReducer,
  view_data_store: ViewDataReducer,
  report_store: ReportReducer,
  sources: SourceReducer,
  captured_report: CapturedReportReducer,
  maintain_report_rules_store: MaintainReportRulesReducer,
  source_feeds: MaintainSourcesReducer,
  variance_analysis_store: VarianceAnalysisReducer,
  create_report_store: CreateReportReducer,
  login_store: LoginReducer,
  def_change_store: DefChangeReducer,
  data_change_store: DataChangeReducer,
  role_management: RolesReducer,
  form: formReducer,
  rule_assist: RuleAssistReducer,
  customize_dash: userDetailsReducer,
  api_details: apiDetailsReducer,
  leftmenu_store: LeftMenuReducer,
  loadData: LoadDataReducer,
  displayMessage: DisplayMessageReducer,
  capture_template:CaptureTemplateReducer,
  transreport: TransactionReportReducer,
});

export const store=createStore(rootReducer);
export default rootReducer;
