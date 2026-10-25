import { INITIAL_JOBS } from '../data/jobs';

const textValue = (value, fallback = '') =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback;

const tagsForJob = (value) =>
  Array.isArray(value)
    ? value.filter((tag) => typeof tag === 'string' && tag.trim()).map((tag) => tag.trim())
    : [];

const isValidRecord = (item) =>
  item &&
  typeof item === 'object' &&
  !Array.isArray(item) &&
  typeof item.title === 'string' &&
  item.title.trim() &&
  typeof item.company_name === 'string' &&
  item.company_name.trim();

const formatPostedDate = (createdAt) => {
  const date =
    typeof createdAt === 'number' && Number.isFinite(createdAt)
      ? new Date(createdAt * 1000)
      : typeof createdAt === 'string'
        ? new Date(createdAt)
        : null;
  return date && Number.isFinite(date.getTime())
    ? date.toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
};

const mapApiJob = (item, index) => {
  if (!isValidRecord(item)) return null;

  const title = item.title.trim();
  const company = item.company_name.trim();
  const location = textValue(item.location, 'Global');
  const lowerLocation = location.toLowerCase();
  const isRemote = item.remote === true || lowerLocation.includes('remote');
  const workMode = isRemote ? 'Remote' : 'Office';
  const jobTags = tagsForJob(item.tags);
  const slug = textValue(item.slug);
  const apiId = textValue(item.id);
  const stablePart =
    slug ||
    apiId ||
    `${company}-${title}-${location}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
    String(index);
  const description = textValue(item.description)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    id: `api-${stablePart}`,
    title,
    company,
    logo: isRemote ? '🌐' : '🏛️',
    location,
    country: lowerLocation.includes('germany')
      ? 'Germany'
      : isRemote
        ? 'Worldwide'
        : location,
    type: textValue(Array.isArray(item.job_types) ? item.job_types[0] : '', 'Full-time'),
    workMode,
    workModeLabel: isRemote ? 'Remote — Worldwide' : `On-site — ${location}`,
    salary: textValue(item.salary, '$80,000 - $110,000 / year'),
    category: jobTags[0] || 'Engineering',
    skills: jobTags.length ? jobTags : ['JavaScript', 'API', 'Web'],
    description: description ? description.slice(0, 300) : 'Great global career opportunity.',
    eligibility: 'Bachelor degree in relevant discipline. Strong problem solving & communication.',
    postedDate: formatPostedDate(item.created_at),
    deadline: '2026-10-31',
    applicantsCount: 0,
    isApiJob: true,
  };
};

/**
 * Fetches live listings and maps valid records into the HustleNest job schema.
 * Invalid records are skipped so one incomplete API item cannot break the feed.
 */
export const fetchJobsFromApi = async () => {
  try {
    const response = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data?.data)) {
      throw new Error('The jobs API returned an invalid response.');
    }

    const apiJobs = data.data
      .slice(0, 50)
      .map(mapApiJob)
      .filter(Boolean);

    if (!apiJobs.length) {
      return {
        success: false,
        jobs: INITIAL_JOBS,
        error: 'The jobs API did not return any valid job records.',
        source: 'Local Demo Dataset (Fallback)',
      };
    }

    return { success: true, jobs: apiJobs, source: 'Arbeitnow Public API' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('Live Jobs API request notice:', message);
    return {
      success: false,
      error: message,
      jobs: INITIAL_JOBS,
      source: 'Local Demo Dataset (Fallback)',
    };
  }
};
