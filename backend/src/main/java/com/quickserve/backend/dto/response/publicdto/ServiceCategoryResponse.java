package com.quickserve.backend.dto.response.publicdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategoryResponse {
    private String value;
    private String displayName;
    private String icon;
    private Integer providerCount;
}
