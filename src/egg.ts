export type Egg = {
  "version": "0.0.0",
  "name": "egg",
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "storageAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "mintEgg",
      "accounts": [
        {
          "name": "storageAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tribe",
          "type": {
            "array": [
              "u64",
              4
            ]
          }
        }
      ]
    },
    {
      "name": "mintEggOne",
      "accounts": [
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "storageAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tribe",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintEggFour",
      "accounts": [
        {
          "name": "tokenAccountOne",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintOne",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountTwo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintTwo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountThree",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintThree",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountFour",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintFour",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tribe",
          "type": {
            "array": [
              "u64",
              4
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "storageInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "eggsByTribe",
            "type": {
              "array": [
                "u32",
                5
              ]
            }
          },
          {
            "name": "eggsCount",
            "type": "u32"
          },
          {
            "name": "eggTotalCount",
            "type": "u32"
          },
          {
            "name": "eggLimitNormal",
            "type": "u32"
          },
          {
            "name": "eggLimitNo",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "NotEnoughSOL",
      "msg": "Not enough SOL to pay for this minting"
    }
  ]
};

export const IDL: Egg = {
  "version": "0.0.0",
  "name": "egg",
  "instructions": [
    {
      "name": "init",
      "accounts": [
        {
          "name": "storageAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "mintEgg",
      "accounts": [
        {
          "name": "storageAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tribe",
          "type": {
            "array": [
              "u64",
              4
            ]
          }
        }
      ]
    },
    {
      "name": "mintEggOne",
      "accounts": [
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "storageAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tribe",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintEggFour",
      "accounts": [
        {
          "name": "tokenAccountOne",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintOne",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountTwo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintTwo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountThree",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintThree",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccountFour",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintFour",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tribe",
          "type": {
            "array": [
              "u64",
              4
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "storageInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "eggsByTribe",
            "type": {
              "array": [
                "u32",
                5
              ]
            }
          },
          {
            "name": "eggsCount",
            "type": "u32"
          },
          {
            "name": "eggTotalCount",
            "type": "u32"
          },
          {
            "name": "eggLimitNormal",
            "type": "u32"
          },
          {
            "name": "eggLimitNo",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 300,
      "name": "NotEnoughSOL",
      "msg": "Not enough SOL to pay for this minting"
    }
  ]
};
