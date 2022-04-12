export type BreedingContract = {
  "version": "0.1.0",
  "name": "breeding_contract",
  "instructions": [
    {
      "name": "createVault",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
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
          "name": "bumpVault",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createUserPool",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
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
          "name": "bump1",
          "type": "u8"
        },
        {
          "name": "bump2",
          "type": "u8"
        }
      ]
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fatherMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fatherFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fatherTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "motherMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "motherFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "motherTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
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
        }
      ],
      "args": []
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fatherMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fatherFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fatherTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "motherMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "motherFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "motherTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "nfts",
            "type": {
              "vec": {
                "defined": "BreedInfo"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "bumpSigner",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BreedInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fatherMint",
            "type": "publicKey"
          },
          {
            "name": "motherMint",
            "type": "publicKey"
          },
          {
            "name": "startDate",
            "type": "u32"
          },
          {
            "name": "endDate",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PoolOwnerInvalid",
      "msg": "User is not pool owner."
    },
    {
      "code": 6001,
      "name": "TokenNotExist",
      "msg": "Token doesn't exist."
    },
    {
      "code": 6002,
      "name": "StakingLocked",
      "msg": "Staking is locked."
    }
  ]
};

export const IDL: BreedingContract = {
  "version": "0.1.0",
  "name": "breeding_contract",
  "instructions": [
    {
      "name": "createVault",
      "accounts": [
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
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
          "name": "bumpVault",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createUserPool",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
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
          "name": "bump1",
          "type": "u8"
        },
        {
          "name": "bump2",
          "type": "u8"
        }
      ]
    },
    {
      "name": "stake",
      "accounts": [
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fatherMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fatherFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fatherTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "motherMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "motherFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "motherTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenTo",
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
        }
      ],
      "args": []
    },
    {
      "name": "unstake",
      "accounts": [
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolSigner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "fatherMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fatherFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "fatherTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "motherMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "motherFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "motherTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "nfts",
            "type": {
              "vec": {
                "defined": "BreedInfo"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "bumpSigner",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "BreedInfo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fatherMint",
            "type": "publicKey"
          },
          {
            "name": "motherMint",
            "type": "publicKey"
          },
          {
            "name": "startDate",
            "type": "u32"
          },
          {
            "name": "endDate",
            "type": "u32"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "PoolOwnerInvalid",
      "msg": "User is not pool owner."
    },
    {
      "code": 6001,
      "name": "TokenNotExist",
      "msg": "Token doesn't exist."
    },
    {
      "code": 6002,
      "name": "StakingLocked",
      "msg": "Staking is locked."
    }
  ]
};
