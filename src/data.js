export const seedDepartments = [
 {id:'d1',name:'University Administration',description:'Certificates, records and general university services',icon:'Building2',services:['Bonafide Certificate','Student Record Update','General Inquiry']},
 {id:'d2',name:'Admissions Office',description:'Applications, admission status and guidance',icon:'GraduationCap',services:['Admission Guidance','Application Review','Document Verification']},
 {id:'d3',name:'Examination Office',description:'Results, transcripts and examination matters',icon:'BookOpen',services:['Transcript Request','Result Inquiry','Exam Form Support']},
 {id:'d4',name:'Student Affairs',description:'Student support, cards and campus guidance',icon:'Users',services:['Student Card','Society Registration','Student Support']},
 {id:'d5',name:'Finance Department',description:'Fee vouchers, payments and financial queries',icon:'Wallet',services:['Fee Voucher','Payment Verification','Scholarship Query']},
 {id:'d6',name:'General Consultation',description:'General information and front-desk support',icon:'MessageCircle',services:['General Consultation','Information Desk']}
];
export const seedAppointments = [
 {id:'QL-82451',token:'A-014',userEmail:'fiza@example.com',userName:'Fiza Javed',department:'Examination Office',service:'Transcript Request',date:new Date().toISOString().slice(0,10),time:'10:30',status:'approved',details:'Need transcript information'},
 {id:'QL-82452',token:'A-015',userEmail:'demo@queueless.demo',userName:'Demo Student',department:'Student Affairs',service:'Student Card',date:new Date().toISOString().slice(0,10),time:'11:00',status:'pending',details:'Student card renewal'},
 {id:'QL-82453',token:'B-008',userEmail:'fiza@example.com',userName:'Fiza Javed',department:'Admissions Office',service:'Admission Guidance',date:new Date(Date.now()+86400000).toISOString().slice(0,10),time:'09:30',status:'completed',details:'Admission query'}
];
export const chartData = [{day:'Mon',appointments:24,completed:18},{day:'Tue',appointments:32,completed:26},{day:'Wed',appointments:28,completed:21},{day:'Thu',appointments:40,completed:34},{day:'Fri',appointments:35,completed:29},{day:'Sat',appointments:19,completed:16},{day:'Sun',appointments:12,completed:9}];