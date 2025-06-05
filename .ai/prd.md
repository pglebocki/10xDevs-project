# Product Requirements Document (PRD) - GitHub Developer Activity Dashboard

## 1. Product Overview
The GitHub Developer Activity Dashboard is a web application that enables viewing developer activity reports on GitHub repositories. The application offers visualization of Pull Request history in the form of a horizontal timeline, where each PR is represented as a bar with a specific status (open, merged, cancelled). The system integrates with GitHub REST API using a token and utilizes caching mechanisms and automatic refresh to ensure fast data access. The repository list is static and hardcoded, and the interface allows developer selection and detailed information display on hover.

## 2. User Problem
Users, such as managers and team leaders, need a tool that enables quick and transparent monitoring of developer activity. The key problem is assessing how long it takes a developer to gather approvals, introduce fixes, address provided feedback, and merge a Pull Request. The lack of such a tool makes it difficult to identify bottlenecks in the code review process and affects team efficiency.

## 3. Functional Requirements
1. Static repository list - the system should display a list of repositories with name and URL.
2. Developer selection - the user should be able to select a developer from the list assigned to a given repository.
3. The service must have the ability to display different metrics. For MVP, 1 metric is sufficient (pull request visualization), but there must be the possibility to change the view in the UI to another metric.
4. Timeline - visualization of Pull Requests as horizontal bars with status indication:
   - Open
   - Merged
   - Cancelled
5. PR details - when hovering over a timeline element, information should appear about:
   - User who performed the action
   - Comment or approval identifier
6. GitHub REST API integration - fetching data regarding Pull Requests and related events (commits, comments, approvals) using a token.
7. Caching mechanism - the backend should cache fetched data and automatically refresh information at specified intervals.
8. User interface:
   - Display progress bar during data fetching.
   - Error handling with clear message display.

## 4. Product Boundaries
1. MVP does not include advanced analytical metrics.
2. The repository list is static and cannot be added or modified by the user.
3. Interactions are limited to developer selection, timeline browsing, and PR details display on hover.
4. No data modification capability - the application serves only for review purposes.
5. The project does not require user authentication mechanism implementation. The page will be hosted on GitHub Pages where access control is at the repository settings level.

## 5. User Stories

ID: US-001
Title: Repository Selection
Description: As a user, I want to see a static list of repositories to choose a data source for activity analysis.
Acceptance Criteria:
  - Repository list contains name and URL.
  - Repositories are displayed in a readable form.
  - Repository selection updates available data for subsequent operations.

ID: US-002
Title: Developer Selection
Description: As a user, I want to select a developer associated with the chosen repository to see their activity.
Acceptance Criteria:
  - System displays developer list after repository selection.
  - Developer selection updates the PR timeline.
  - Developer list is readable and intuitive.

ID: US-003
Title: Metric View Selection
Description: As a user, I want to have the ability to switch between different metrics.
Acceptance Criteria:
  - For MVP, 1 metric is sufficient (PR Timeline)
  - There is a switcher in the UI to select other metrics
  - The 2nd metric should be added as an empty page

ID: US-004
Title: Timeline Visualization
Description: As a user, I want to see an interactive timeline where Pull Requests are presented as dynamic charts created using Chart.js library, to quickly assess developer activity history.
Acceptance Criteria:
  - Timeline presents PRs as dynamic charts generated using Chart.js.
  - Each bar represents a PR and has clear status indication (open, merged, cancelled).
  - When hovering over a chart, a tooltip with additional PR information is displayed.
  - Current point on the timeline is highlighted.
  - Timeline contains time markers for important events.

ID: US-005
Title: PR Details Display
Description: As a user, I want additional information about a given PR to be displayed when hovering over a timeline element, such as user, comment identifier, or approval.
Acceptance Criteria:
  - A tooltip with additional information appears on hover.
  - Tooltip information includes user data and comment/approval identifiers.
  - Tooltip does not interfere with interface functionality.

ID: US-006
Title: GitHub REST API Integration and Caching Mechanism
Description: As a user, I want the system to fetch data from GitHub REST API and cache it to ensure fast access and information currency.
Acceptance Criteria:
  - Application fetches data from GitHub REST API using correct token.
  - Data is cached in the backend.
  - Automatic data refresh occurs according to established interval.
  - In case of data fetching error, an error message is displayed.

ID: US-007
Title: Loading State and Error Handling
Description: As a user, I want to see a loading indicator and appropriate error messages to be aware of system state during data fetching.
Acceptance Criteria:
  - Progress bar is displayed during data fetching.
  - In case of error, system presents clear problem message.
  - User is informed about operation status in real-time.

## 6. Success Metrics
1. Timeline visualization accuracy – correct display of PR statuses and time markers.
2. Average time for gathering approvals, introducing fixes, addressing feedback, and merging PR.
3. Error rate during data fetching – number of failed GitHub API requests should be minimal.
4. User satisfaction level – positive feedback regarding interface usefulness.
5. Data refresh speed – automatic refresh occurs at established intervals without noticeable delays. 