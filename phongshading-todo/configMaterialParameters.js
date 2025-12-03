function configurePhongModelMeterialParameters(program) {

	var ambientStrength = 0.5; //ka
	var diffuseStrength = 0.5; //kd
	var specularStrength = 0.5; //ks
	var ambientStrength = 0.5;

	var materialShininess = 100.0; //材质镜面反射抛光系数

	var lightColor = vec3(1.0, 1.0, 1.0); //入射光拟定为白光Id,Is采用�?
	//----------传递材质的常量参数给shader--------------------------------------------------------
	gl.uniform1f(gl.getUniformLocation(program, "ambientKaStrength"), ambientStrength);
	gl.uniform1f(gl.getUniformLocation(program, "diffuseStrength"), diffuseStrength);
	gl.uniform1f(gl.getUniformLocation(program, "specularStrength"), specularStrength);
	gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
	gl.uniform1f(gl.getUniformLocation(program, "u_opacity"), 1.0);
	gl.uniform3fv(gl.getUniformLocation(program, "lightColor"), flatten(lightColor));

}