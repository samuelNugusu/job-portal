import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Job, JobSearchFilters } from "@/types"
import { mockJobs } from "@/data/mockData"

interface JobState {
  jobs: Job[]
  loading: boolean
  error: string | null
  activeFilters: string[]
  searchResults: Job[]
}

const initialState: JobState = {
  jobs: [],
  loading: false,
  error: null,
  activeFilters: [],
  searchResults: [],
}

// Async thunks
export const loadJobs = createAsyncThunk("jobs/loadJobs", async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockJobs
})

export const searchJobs = createAsyncThunk("jobs/searchJobs", async (filters: JobSearchFilters) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredJobs = [...mockJobs]

  if (filters.searchTerm) {
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(filters.searchTerm.toLowerCase())),
    )
  }

  if (filters.location) {
    filteredJobs = filteredJobs.filter((job) => job.location.toLowerCase().includes(filters.location.toLowerCase()))
  }

  if (filters.jobType) {
    filteredJobs = filteredJobs.filter((job) => job.type.toLowerCase() === filters.jobType.toLowerCase())
  }

  return filteredJobs
})

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    toggleFilter: (state, action: PayloadAction<string>) => {
      const filterId = action.payload
      const index = state.activeFilters.indexOf(filterId)

      if (index > -1) {
        state.activeFilters.splice(index, 1)
      } else {
        state.activeFilters.push(filterId)
      }
    },

    clearFilters: (state) => {
      state.activeFilters = []
      state.jobs = mockJobs
      state.searchResults = []
    },

    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload
    },

    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Load jobs
      .addCase(loadJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
        state.error = null
      })
      .addCase(loadJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load jobs"
      })

      // Search jobs
      .addCase(searchJobs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false
        state.jobs = action.payload
        state.searchResults = action.payload
        state.error = null
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to search jobs"
      })
  },
})

export const { toggleFilter, clearFilters, setJobs, clearError } = jobSlice.actions
export default jobSlice.reducer
