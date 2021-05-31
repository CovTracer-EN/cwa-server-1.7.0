CREATE TABLE diagnosis_key (
    key_data bytea PRIMARY KEY,
    rolling_period integer NOT NULL,
    rolling_start_interval_number integer NOT NULL,
    submission_timestamp bigint NOT NULL,
    transmission_risk_level integer NOT NULL
);

CREATE TABLE exposure_configuration (
    id integer NOT NULL,
    config json,
    PRIMARY KEY (id)
);

CREATE TABLE index_file (
    id integer NOT NULL,
    content character varying,
    PRIMARY KEY (id)
);

INSERT INTO exposure_configuration VALUES ('1', '{"DailySummariesConfig":{
  "attenuationDurationThresholds": [40, 53, 60],
  "attenuationBucketWeights": [1, 1, 0.5, 0],
  "reportTypeWeights": [1, 0, 0, 0],
  "reportTypeWhenMissing": 1,
  "infectiousnessWeights": [1, 1],
  "daysSinceOnsetToInfectiousness": [[-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1], [12, 1], [13, 1], [14, 1]],
  "infectiousnessWhenDaysSinceOnsetMissing": 1
  },
  "triggerThresholdWeightedDuration": 15
}');

INSERT INTO index_file VALUES ('1', '')
