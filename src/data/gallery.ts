// ============================================
// PROJECT GALLERY — screenshots per project
// Captions follow the filenames provided for each screenshot.
// ============================================

import agrisenseIntake from '../assets/projects/AgriSense/conversation-intake.png';
import agrisenseTrace from '../assets/projects/AgriSense/conversation-agent-trace.png';
import agrisenseCrop from '../assets/projects/AgriSense/conversation-crop-recommendation.png';
import agrisenseDiseaseUpload from '../assets/projects/AgriSense/disease-detection-upload.png';
import agrisenseDiseaseResult from '../assets/projects/AgriSense/disease-detection-result.png';
import agrisenseFarmOps from '../assets/projects/AgriSense/farm-operations-collage.png';
import agrisenseRag from '../assets/projects/AgriSense/rag-knowledge-base.png';
import agrisenseSeason from '../assets/projects/AgriSense/season-planner.png';
import agrisenseWeather from '../assets/projects/AgriSense/weather-dashboard.png';

import badhanLogin from '../assets/projects/Badhan Report Management System/badhan-login.png';
import badhanCentralDashboard from '../assets/projects/Badhan Report Management System/badhan-central-dashboard.png';
import badhanZonalDashboard from '../assets/projects/Badhan Report Management System/badhan-zonal-dashboard.png';
import badhanUnitDashboard from '../assets/projects/Badhan Report Management System/badhan-unit-dashboard.png';
import badhanUnitDataEntry from '../assets/projects/Badhan Report Management System/badhan-unit-data-entry.png';
import badhanUnitPastReports from '../assets/projects/Badhan Report Management System/badhan-unit-past-reports.png';
import badhanMasterReports from '../assets/projects/Badhan Report Management System/badhan-master-reports.png';
import badhanCentralReportMonth from '../assets/projects/Badhan Report Management System/badhan-central-custom-report(month based).png';
import badhanCentralReportZone from '../assets/projects/Badhan Report Management System/badhan-central-custom-report(zone based).png';
import badhanPastSubmissionsZone from '../assets/projects/Badhan Report Management System/badhan-past-report-submissions(zone).png';
import badhanSampleReport from '../assets/projects/Badhan Report Management System/sample-unit-report.png';
import badhanCertGenerator from '../assets/projects/Badhan Report Management System/badhan-certficiate-generator.png';
import badhanCertSample from '../assets/projects/Badhan Report Management System/badhan-certificate-sample.png';
import badhanCertVerification from '../assets/projects/Badhan Report Management System/badhan-certificate-verification.png';

import bowOt0 from '../assets/projects/BOwOt/BOwOt-0.jpg';
import bowOt1 from '../assets/projects/BOwOt/BOwOt-1.jpg';

import dheuHome from '../assets/projects/Dheu/Dheu-home.png';
import dheuRoughness from '../assets/projects/Dheu/Dheu-Sea-Roughness-Calculator.png';

export interface ProjectImage {
  src: string;
  caption: string;
}

/**
 * Screenshots grouped by project id (matches Project.id in content.ts).
 * The first image is used as the card cover; all open in the project viewer.
 */
export const PROJECT_GALLERY: Record<string, ProjectImage[]> = {
  agrisense: [
    { src: agrisenseIntake, caption: 'Conversational intake flow' },
    { src: agrisenseTrace, caption: 'Agentic reasoning trace' },
    { src: agrisenseCrop, caption: 'Crop recommendation conversation' },
    { src: agrisenseDiseaseUpload, caption: 'Disease detection — upload' },
    { src: agrisenseDiseaseResult, caption: 'Disease detection — result' },
    { src: agrisenseFarmOps, caption: 'Farm operations collage' },
    { src: agrisenseRag, caption: 'RAG knowledge base' },
    { src: agrisenseSeason, caption: 'Season planner' },
    { src: agrisenseWeather, caption: 'Weather dashboard' },
  ],
  badhan: [
    { src: badhanCentralDashboard, caption: 'Central dashboard' },
    { src: badhanLogin, caption: 'Role-based login' },
    { src: badhanZonalDashboard, caption: 'Zonal dashboard' },
    { src: badhanUnitDashboard, caption: 'Unit dashboard' },
    { src: badhanUnitDataEntry, caption: 'Unit data entry' },
    { src: badhanUnitPastReports, caption: 'Unit — past reports' },
    { src: badhanMasterReports, caption: 'Master reports' },
    { src: badhanCentralReportMonth, caption: 'Central custom report — month based' },
    { src: badhanCentralReportZone, caption: 'Central custom report — zone based' },
    { src: badhanPastSubmissionsZone, caption: 'Past report submissions — zone view' },
    { src: badhanSampleReport, caption: 'Sample generated report (PDF)' },
    { src: badhanCertGenerator, caption: 'Certificate generator' },
    { src: badhanCertSample, caption: 'Certificate sample' },
    { src: badhanCertVerification, caption: 'Certificate verification' },
  ],
  'companion-buddy': [
    { src: bowOt0, caption: 'BOwOt — assembled prototype' },
    { src: bowOt1, caption: 'BOwOt — hardware detail' },
  ],
  dheu: [
    { src: dheuHome, caption: 'Dheu — ocean watch home' },
    { src: dheuRoughness, caption: 'Dheu — sea roughness calculator' },
  ],
};
