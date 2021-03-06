package at.ac.tuwien.dmap.dmapbackend.re3data.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * This enum is used as a target for unmarshalling the XML response from the re3data API.
 * Conforms to http://schema.re3data.org/2-2/re3dataV2-2.xsd
 */
public enum AidSystems {
    @JsonProperty("AuthorClaim")
    AUTHOR_CLAIM,
    @JsonProperty("ISNI")
    ISNI,
    @JsonProperty("ORCID")
    ORCID,
    @JsonProperty("ResearcherID")
    RESEARCHER_ID,
    @JsonProperty("other")
    OTHER,
    @JsonProperty("none")
    NONE
}
