import {
  eventsFiltersContainer,
  eventsList,
  eventsStore,
  selectCategoryEvent,
  selectCategoryForm,
  selectDistanceEvent,
  selectDistanceForm,
  selectedFilters,
  selectTypeEvent,
  selectTypeForm,
} from "./elements.js";
import { formatDate } from "./utils.js";

// Инициализация селекторов
initSelectMenu(selectTypeEvent, "typeEvent", "type");
initSelectMenu(selectDistanceEvent, "distanceEvent", "distance");
initSelectMenu(selectCategoryEvent, "categoryEvent", "category");

// Создание карточек событий
createCards(eventsStore);

function createCards(events) {
  eventsList.textContent = "";
  events.forEach(createCard);
}

function createCard(event) {
  const eventHr = document.createElement("hr");
  eventHr.classList.add("border");

  const eventContainer = document.createElement("div");
  eventContainer.classList.add("eventContainer");

  const eventImageContainer = document.createElement("div");
  eventImageContainer.classList.add("eventImageContainer");

  const eventImage = document.createElement("img");
  eventImage.classList.add("eventImage");
  eventImage.setAttribute("src", event.image);

  const eventBadge = document.createElement("div");
  eventBadge.classList.add("eventBadge");

  const eventBadgeType = document.createElement("p");
  eventBadgeType.classList.add("eventBadgeType");

  const eventInfoContainer = document.createElement("div");
  eventInfoContainer.classList.add("eventInfoContainer");

  const eventDateInfoPar = document.createElement("p");
  eventDateInfoPar.classList.add("eventDateInfo", "text500");
  eventDateInfoPar.textContent = formatDate(event.date);

  const eventTitleHeader = document.createElement("h4");
  eventTitleHeader.classList.add("eventTitleHeader", "text500");
  eventTitleHeader.textContent = event.title;

  const eventLocationInfo = document.createElement("p");
  eventLocationInfo.classList.add("eventLocationInfo");
  eventLocationInfo.textContent = event.category;

  const eventAttendees = document.createElement("p");
  eventAttendees.classList.add("eventAttendees");
  if (event.attendees) {
    eventAttendees.textContent = event.attendees;
  }

  const eventType = document.createElement("p");
  eventType.classList.add("eventType");

  eventInfoContainer.append(
    eventDateInfoPar,
    eventTitleHeader,
    eventLocationInfo
  );
  if (eventAttendees.textContent) {
    eventInfoContainer.append(eventAttendees);
  }

  eventImageContainer.append(eventImage);

  if (event.type === "online") {
    eventType.textContent = "Online";
    eventBadgeType.textContent = "Online Event";
    eventBadge.style.display = "block";
    eventBadge.append(eventBadgeType);
    eventImageContainer.append(eventBadge);
    eventInfoContainer.append(eventType);
  }

  eventContainer.append(eventImageContainer, eventInfoContainer);
  eventsList.append(eventHr, eventContainer);
}

function initSelectMenu(selectMenu, filterKey, filterType) {
  const selectTitle = selectMenu.querySelector(".selectMenuEventTitle");
  const selectLabels = selectMenu.querySelectorAll(".__select__label");

  selectTitle.addEventListener("click", () => {
    const isActive = selectMenu.getAttribute("data-state") === "active";
    selectMenu.setAttribute("data-state", isActive ? "" : "active");
    eventsFiltersContainer.style.paddingBottom = isActive
      ? "10px"
      : `${selectLabels.length * 40}px`;
  });

  document.addEventListener("click", (event) => {
    if (!selectMenu.contains(event.target)) {
      selectMenu.setAttribute("data-state", "");
    }
  });

  selectLabels.forEach((label) => {
    label.addEventListener("click", (event) => {
      const selectedValue = event.target.textContent;
      selectedFilters[filterKey] = parseFilterValue(selectedValue, filterKey);

      filterEvents(filterType, eventsStore, selectedFilters);

      selectTitle.textContent = selectedValue;
      selectMenu.setAttribute("data-state", "");
      eventsFiltersContainer.style.paddingBottom = "10px";
    });
  });
}

function parseFilterValue(value, filterKey) {
  if (filterKey === "distanceEvent" && value !== "Any distance") {
    return parseInt(value.split("km")[0], 10);
  }
  return value;
}

function filterEvents(filterType, events, filters) {
  const filteredEvents = events.filter((event) => {
    switch (filterType) {
      case "type":
        return (
          filters.typeEvent === "Any type" ||
          event.type === filters.typeEvent.toLowerCase()
        );
      case "distance":
        return (
          filters.distanceEvent === "Any distance" ||
          event.distance === filters.distanceEvent
        );
      case "category":
        return (
          filters.categoryEvent === "Any category" ||
          event.category === filters.categoryEvent
        );
      default:
        return true;
    }
  });

  createCards(filteredEvents);
}
