package com.dcisman.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntry {

    private Long userId;
    private String username;
    private String name;
    private String idNumber;
    private Integer value;
    private Integer rank;
}
