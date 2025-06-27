/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/coduet.json`.
 */
export type Coduet = {
  "address": "G5gcEvNxXPxsUwKmGNxNheKq2j5nBghciJpCyooPCKdd",
  "metadata": {
    "name": "coduet",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "DevHelpProtocol - Smart contract for developer hiring"
  },
  "instructions": [
    {
      "name": "acceptHelper",
      "discriminator": [
        185,
        215,
        221,
        137,
        109,
        218,
        17,
        143
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "helpRequest",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  112,
                  95,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "post"
              },
              {
                "kind": "account",
                "path": "applicant"
              }
            ]
          }
        },
        {
          "name": "applicant"
        },
        {
          "name": "mainVault",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        },
        {
          "name": "applicant",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "applyHelp",
      "discriminator": [
        226,
        57,
        113,
        97,
        57,
        59,
        193,
        11
      ],
      "accounts": [
        {
          "name": "applicant",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "mainVault",
          "writable": true
        },
        {
          "name": "helpRequest",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  101,
                  108,
                  112,
                  95,
                  114,
                  101,
                  113,
                  117,
                  101,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "post"
              },
              {
                "kind": "account",
                "path": "applicant"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelPost",
      "discriminator": [
        118,
        74,
        85,
        57,
        218,
        233,
        220,
        200
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "mainVault",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "platformFeeRecipient",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "completeContract",
      "discriminator": [
        129,
        158,
        69,
        250,
        180,
        196,
        197,
        185
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "mainVault",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "helper",
          "writable": true
        },
        {
          "name": "platformFeeRecipient",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createPost",
      "discriminator": [
        123,
        92,
        184,
        29,
        231,
        24,
        15,
        202
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "post",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "postId"
              }
            ]
          }
        },
        {
          "name": "mainVault",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "postId",
          "type": "u64"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "value",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "helpRequest",
      "discriminator": [
        125,
        85,
        192,
        87,
        157,
        53,
        23,
        169
      ]
    },
    {
      "name": "post",
      "discriminator": [
        8,
        147,
        90,
        186,
        185,
        56,
        192,
        150
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidHourlyRate",
      "msg": "Invalid hourly rate - must be greater than 0"
    },
    {
      "code": 6001,
      "name": "invalidEstimatedHours",
      "msg": "Invalid estimated hours - must be between 1 and 255"
    },
    {
      "code": 6002,
      "name": "postNotOpen",
      "msg": "Post is not open for applications"
    },
    {
      "code": 6003,
      "name": "postAlreadyCompleted",
      "msg": "Post is already completed"
    },
    {
      "code": 6004,
      "name": "postAlreadyHasHelper",
      "msg": "Post already has an accepted helper"
    },
    {
      "code": 6005,
      "name": "helpRequestNotFound",
      "msg": "Help request not found"
    },
    {
      "code": 6006,
      "name": "helpRequestNotPending",
      "msg": "Help request is not pending"
    },
    {
      "code": 6007,
      "name": "unauthorizedPublisher",
      "msg": "Only publisher can perform this action"
    },
    {
      "code": 6008,
      "name": "cannotCancelWithHelper",
      "msg": "Cannot cancel post with accepted helper"
    },
    {
      "code": 6009,
      "name": "insufficientFunds",
      "msg": "Insufficient funds for post creation"
    },
    {
      "code": 6010,
      "name": "invalidPlatformFee",
      "msg": "Invalid platform fee"
    },
    {
      "code": 6011,
      "name": "postNotFound",
      "msg": "Post not found"
    },
    {
      "code": 6012,
      "name": "alreadyApplied",
      "msg": "User already applied to this post"
    },
    {
      "code": 6013,
      "name": "invalidPostId",
      "msg": "Invalid post ID"
    },
    {
      "code": 6014,
      "name": "postExpired",
      "msg": "Post has expired"
    },
    {
      "code": 6015,
      "name": "invalidTitleLength",
      "msg": "Invalid title length"
    },
    {
      "code": 6016,
      "name": "invalidDescriptionLength",
      "msg": "Invalid description length"
    },
    {
      "code": 6017,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6018,
      "name": "invalidValue",
      "msg": "Invalid value"
    }
  ],
  "types": [
    {
      "name": "helpRequest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "postId",
            "type": "u64"
          },
          {
            "name": "applicant",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "helpRequestStatus"
              }
            }
          },
          {
            "name": "appliedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "helpRequestStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "accepted"
          },
          {
            "name": "rejected"
          }
        ]
      }
    },
    {
      "name": "post",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "value",
            "type": "u64"
          },
          {
            "name": "isOpen",
            "type": "bool"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "acceptedHelper",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "isCompleted",
            "type": "bool"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "expiresAt",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
