#version 300 es
precision mediump float;

out vec4 FragColor;

uniform float ambientStrength, specularStrength, diffuseStrength,shininess;

in vec3 Normal;//法向量
in vec3 FragPos;//相机观察的片元位置
in vec2 TexCoord;//纹理坐标
in vec4 FragPosLightSpace;//光源观察的片元位置

uniform vec3 viewPos;//相机位置
uniform vec4 u_lightPosition; //光源位置	
uniform vec3 lightColor;//入射光颜色
uniform float u_opacity;//透明度变量

uniform sampler2D diffuseTexture;
uniform sampler2D depthTexture;
uniform samplerCube cubeSampler;//盒子纹理采样器


float shadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir)
{
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;

    projCoords = projCoords * 0.5 + 0.5;

    if(projCoords.z > 1.0 || projCoords.x < 0.0 || projCoords.x > 1.0 ||
       projCoords.y < 0.0 || projCoords.y > 1.0)
        return 0.0;

    float currentDepth = projCoords.z;

    float closestDepth = texture(depthTexture, projCoords.xy).r;

    float bias = max(0.005 * (1.0 - dot(normal, lightDir)), 0.001);

    float shadow = (currentDepth - bias) > closestDepth ? 1.0 : 0.0;

    return shadow;
}

void main()
{
    
    //采样纹理颜色
    vec3 TextureColor = texture(diffuseTexture, TexCoord).xyz;

    //计算光照颜色
 	vec3 norm = normalize(Normal);
	vec3 lightDir;
	if(u_lightPosition.w==1.0) 
        lightDir = normalize(u_lightPosition.xyz - FragPos);
	else lightDir = normalize(u_lightPosition.xyz);
	vec3 viewDir = normalize(viewPos - FragPos);
	vec3 halfDir = normalize(viewDir + lightDir);


	/*TODO2:根据phong shading方法计算ambient,diffuse,specular*/
		
	vec3 ambient = ambientStrength * lightColor;
	
	// diffuse (使用纹理作为 Kd)
	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = diffuseStrength * diff * TextureColor * lightColor;
	
	// specular（需要处理背面情况）
	vec3 specular;
	if (dot(lightDir, norm) < 0.0) {
	    specular = vec3(0.0);   // 背面无高光
	} else {
	    float spec = pow(max(dot(norm, halfDir), 0.0), shininess);
	    specular = specularStrength * spec * lightColor;
	}
	
	// combine
	vec3 lightReflectColor = ambient + diffuse + specular;
	
	// shadow mix
	float shadow = shadowCalculation(FragPosLightSpace, norm, lightDir);
	vec3 resultColor = (1.0 - shadow * 0.5) * lightReflectColor;
	
	FragColor = vec4(resultColor, u_opacity);
}






