package com.dre4m1nd.ebap.common.result;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author dre4m1nd
 * @since 2026/1/30
 */
@Data
@Accessors(chain = true)
public class ElectricApiRequest {

    String openId;

    Integer type;
}
